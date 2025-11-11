// settings.js - gestión de configuraciones de nivel (manual / automático)

const DEFAULT_SETTINGS = {
    mode: 'manual', // 'manual' or 'auto'
    manualLevel: 'A1',
    thresholds: { // porcentajes máximos acumulados para cada nivel
        A1: 12,
        A2: 25,
        B1: 50,
        B2: 75,
        C1: 90,
        C2: 100
    }
};

function loadUserSettings() {
    const raw = localStorage.getItem('userSettings');
    if (!raw) {
        localStorage.setItem('userSettings', JSON.stringify(DEFAULT_SETTINGS));
        return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }
    try {
        const parsed = JSON.parse(raw);
        // ensure defaults for missing keys
        return Object.assign({}, DEFAULT_SETTINGS, parsed);
    } catch (e) {
        console.error('Error parsing userSettings, resetting to defaults', e);
        localStorage.setItem('userSettings', JSON.stringify(DEFAULT_SETTINGS));
        return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }
}

function saveUserSettings(settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

// Detectar nivel automáticamente (heurística + opcional IA)
function detectLevelAuto() {
    // Heurística basada en porcentaje de vocabulario estudiado
    const settings = loadUserSettings();
    const total = allVocabulary.length;
    const studied = studiedWords.size;
    const percent = (studied / total) * 100;

    // Find first threshold that percent <= value
    const th = settings.thresholds;
    if (percent <= th.A1) return 'A1';
    if (percent <= th.A2) return 'A2';
    if (percent <= th.B1) return 'B1';
    if (percent <= th.B2) return 'B2';
    if (percent <= th.C1) return 'C1';
    return 'C2';
}

// Obtener nivel activo (según modo)
function getActiveUserLevel() {
    const settings = loadUserSettings();
    if (settings.mode === 'manual') {
        return settings.manualLevel || 'A1';
    } else {
        return detectLevelAuto();
    }
}

// Aplicar filtro por nivel: usa posición index en allVocabulary (asume orden por frecuencia)
function filterByUserLevel(words) {
    if (!Array.isArray(words)) {
        console.warn('filterByUserLevel: words is not an array, returning empty array');
        return [];
    }
    const settings = loadUserSettings();
    const level = settings.mode === 'manual' ? settings.manualLevel : detectLevelAuto();
    const total = allVocabulary.length;

    // Map level to max percent
    const maxPercent = settings.thresholds[level] || 100;
    const maxIndex = Math.floor((maxPercent / 100) * total) - 1;

    // Ensure bounds
    const idx = Math.max(0, Math.min(total - 1, maxIndex));

    // Keep words whose index in allVocabulary is <= idx OR already studied (so user doesn't lose progress)
    const allowedSet = new Set(allVocabulary.slice(0, idx + 1).map(w => w.word));

    return words.filter(w => allowedSet.has(w.word) || studiedWords.has(w.word));
}

// UI helpers
function openLevelSettings() {
    // hide other teacher modules
    document.querySelectorAll('.teacher-module').forEach(m => m.style.display = 'none');
    document.getElementById('levelSettings').style.display = 'block';
    initSettingsUI();
}

function initSettingsUI() {
    const settings = loadUserSettings();
    // mode radios
    document.querySelectorAll('input[name="levelMode"]').forEach(r => {
        r.checked = (r.value === settings.mode);
        r.addEventListener('change', () => {
            const s = loadUserSettings();
            s.mode = document.querySelector('input[name="levelMode"]:checked').value;
            saveUserSettings(s);
            // show/hide manual settings
            toggleManualUI(s.mode === 'manual');
            // update header display
            try { updateActiveLevelDisplay(); } catch (e) {}
        });
    });

    document.getElementById('manualLevelSelect').value = settings.manualLevel;
    document.getElementById('manualLevelSelect').addEventListener('change', () => {
        const s = loadUserSettings();
        s.manualLevel = document.getElementById('manualLevelSelect').value;
        saveUserSettings(s);
        document.getElementById('levelSettingsMessage').textContent = 'Nivel manual actualizado.';
    });

    // thresholds
    document.getElementById('thA1').value = settings.thresholds.A1;
    document.getElementById('thA2').value = settings.thresholds.A2;
    document.getElementById('thB1').value = settings.thresholds.B1;
    document.getElementById('thB2').value = settings.thresholds.B2;
    document.getElementById('thC1').value = settings.thresholds.C1;

    document.getElementById('saveLevelSettings').onclick = () => {
        const s = loadUserSettings();
        s.thresholds.A1 = Number(document.getElementById('thA1').value);
        s.thresholds.A2 = Number(document.getElementById('thA2').value);
        s.thresholds.B1 = Number(document.getElementById('thB1').value);
        s.thresholds.B2 = Number(document.getElementById('thB2').value);
        s.thresholds.C1 = Number(document.getElementById('thC1').value);
        // Ensure monotonic increasing
        if (!(s.thresholds.A1 < s.thresholds.A2 && s.thresholds.A2 < s.thresholds.B1 && s.thresholds.B1 < s.thresholds.B2 && s.thresholds.B2 < s.thresholds.C1 && s.thresholds.C1 <= 100)) {
            document.getElementById('levelSettingsMessage').textContent = 'Por favor, asegúrate de que los porcentajes aumenten correctamente.';
            return;
        }
        saveUserSettings(s);
        document.getElementById('levelSettingsMessage').textContent = 'Ajustes guardados.';
        try { updateActiveLevelDisplay(); } catch (e) {}
    };

    document.getElementById('applyAutoDetect').onclick = async () => {
        document.getElementById('levelSettingsMessage').textContent = 'Detectando nivel...';
        // set mode to auto
        const s = loadUserSettings();
        s.mode = 'auto';
        saveUserSettings(s);

        // First use local heuristic
        const autoLevel = detectLevelAuto();
        document.getElementById('levelSettingsMessage').textContent = `Nivel detectado (heurística): ${autoLevel}`;

        // Try to refine with AI if available
        if (typeof analyzeStudentLevel === 'function') {
            try {
                const stats = getCategoryStats();
                const total = allVocabulary.length;
                const studied = studiedWords.size;
                const aiResp = await analyzeStudentLevel(studied, total, stats);
                // show AI response and suggest level
                document.getElementById('levelSettingsMessage').textContent = `IA: ${aiResp.substring(0,200)}... (heurística: ${autoLevel})`;
            } catch (e) {
                console.error('AI detect error', e);
            }
        }
        try { updateActiveLevelDisplay(); } catch (e) {}
    };

    toggleManualUI(settings.mode === 'manual');
}

function toggleManualUI(show) {
    document.getElementById('manualSettings').style.display = show ? 'block' : 'none';
}

// Update the header-level indicator if present
function updateActiveLevelDisplay() {
    try {
        const el = document.getElementById('activeLevel');
        if (!el) return;
        const lvl = getActiveUserLevel();
        el.textContent = lvl;
    } catch (e) {
        console.error('Error updating active level display', e);
    }
}

// Diagnostics: compute core slice info and sample recommendations
function getLevelDiagnostics() {
    const s = loadUserSettings();
    const level = s.mode === 'manual' ? s.manualLevel : detectLevelAuto();
    const total = allVocabulary.length;
    const maxPercent = s.thresholds[level] || 100;
    const maxIndex = Math.floor((maxPercent / 100) * total) - 1;
    const coreWords = allVocabulary.slice(0, Math.max(0, maxIndex + 1)).map(w => w.word);

    // Attempt to compute candidate pool (include next level)
    const levels = ['A1','A2','B1','B2','C1','C2'];
    const currentIdx = levels.indexOf(level);
    let nextPercent = 100;
    if (currentIdx >= 0 && currentIdx < levels.length - 1) {
        const nextLevel = levels[currentIdx + 1];
        nextPercent = s.thresholds[nextLevel] || 100;
    }
    const nextIndex = Math.floor((nextPercent / 100) * total) - 1;
    const allowedSlice = allVocabulary.slice(0, Math.max(0, nextIndex + 1)).map(w => w.word);

    // Sample recommendations if available
    let sampleRecs = [];
    try {
        if (typeof getSmartRecommendations === 'function') {
            sampleRecs = getSmartRecommendations(5).map(r => r.word);
        }
    } catch (e) {
        console.error('Error getting sample recommendations', e);
    }

    return {
        mode: s.mode,
        level,
        totalWords: total,
        coreCount: coreWords.length,
        allowedCount: allowedSlice.length,
        coreSample: coreWords.slice(0,5),
        allowedSample: allowedSlice.slice(0,5),
        sampleRecs
    };
}

// Hook diagnostics button if present
function initDiagnosticsButton() {
    const btn = document.getElementById('runDiagnostics');
    if (!btn) return;
    btn.onclick = () => {
        const d = getLevelDiagnostics();
        const msg = `Modo: ${d.mode} | Nivel: ${d.level} | Total: ${d.totalWords} | Core: ${d.coreCount} | Allowed(pool): ${d.allowedCount}\nCore sample: ${d.coreSample.join(', ')}\nAllowed sample: ${d.allowedSample.join(', ')}\nSample recommendations: ${d.sampleRecs.join(', ')}`;
        document.getElementById('levelSettingsMessage').textContent = msg;
        console.log('Level diagnostics:', d);
        alert(msg);
    };
}

// Initialize settings UI on load. If DOM is ready, init immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    document.addEventListener('DOMContentLoaded', () => { initSettingsUI(); initDiagnosticsButton(); updateActiveLevelDisplay(); });
} else {
    document.addEventListener('DOMContentLoaded', () => { initSettingsUI(); initDiagnosticsButton(); updateActiveLevelDisplay(); });
}
