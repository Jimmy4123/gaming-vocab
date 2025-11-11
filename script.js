let currentFilter = '';
let currentSearch = '';
let studiedWords = new Set();

// Cargar palabras estudiadas del localStorage
function loadStudiedWords() {
    const saved = localStorage.getItem('studiedWords');
    if (saved) {
        studiedWords = new Set(JSON.parse(saved));
    }
}

// Guardar palabras estudiadas en localStorage
function saveStudiedWords() {
    localStorage.setItem('studiedWords', JSON.stringify([...studiedWords]));
    updateStats();
}

// Mostrar todas las palabras
function displayVocabulary(words = allVocabulary) {
    const container = document.getElementById('vocabContainer');
    if (!container) {
        console.warn('displayVocabulary: #vocabContainer not found');
        return;
    }
    container.innerHTML = '';

    if (words.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron palabras. Intenta con otro filtro.</div>';
        return;
    }

    words.forEach(vocab => {
        const card = document.createElement('div');
        card.className = 'vocab-card';
        if (studiedWords.has(vocab.word)) {
            card.classList.add('studied');
        }

        card.innerHTML = `
            <div class="word">${vocab.word}</div>
            <div class="category">${getCategoryLabel(vocab.category)}</div>
            <div class="pronunciation">
                <span>${vocab.pronunciation}</span>
                <button class="audio-btn" onclick="speakWord('${vocab.word}')">🔊</button>
            </div>
            <div class="meaning">
                <div class="meaning-label">Significado:</div>
                <div class="meaning-text">${vocab.meaning}</div>
            </div>
            <div class="example">
                <div class="example-label">Ejemplo:</div>
                <div class="example-text">"${vocab.example}"</div>
            </div>
            <button class="mark-studied ${studiedWords.has(vocab.word) ? 'marked' : ''}" 
                    onclick="toggleStudied('${vocab.word}', this)">
                ${studiedWords.has(vocab.word) ? '✓ Estudiada' : 'Marcar como estudiada'}
            </button>
        `;

        container.appendChild(card);
    });
}

// Obtener etiqueta de categoría en español
function getCategoryLabel(category) {
    const labels = {
        'combat': '⚔️ Combate',
        'movement': '🏃 Movimiento',
        'items': '📦 Objetos',
        'game-mechanics': '⚙️ Mecánicas',
        'interface': '🖥️ Interfaz',
        'npcs': '👥 Personajes',
        'environment': '🌍 Entorno',
        'advanced': '💎 Avanzado',
        'general': '🎮 General'
    };
    return labels[category] || category;
}

// Reproducir pronunciación
function speakWord(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    } else {
        alert('Tu navegador no soporta pronunciación de audio');
    }
}

// Marcar palabra como estudiada
function toggleStudied(word, button) {
    if (studiedWords.has(word)) {
        studiedWords.delete(word);
        button.classList.remove('marked');
        button.textContent = 'Marcar como estudiada';
    } else {
        studiedWords.add(word);
        button.classList.add('marked');
        button.textContent = '✓ Estudiada';
    }

    // Actualizar card
    const cards = document.querySelectorAll('.vocab-card');
    cards.forEach(card => {
        if (card.querySelector('.word').textContent === word) {
            if (studiedWords.has(word)) {
                card.classList.add('studied');
            } else {
                card.classList.remove('studied');
            }
        }
    });

    saveStudiedWords();
}

// Filtrar palabras
function filterVocabulary() {
    const searchEl = document.getElementById('searchInput');
    const categoryEl = document.getElementById('categoryFilter');
    currentSearch = (searchEl && searchEl.value) ? searchEl.value.toLowerCase() : '';
    currentFilter = (categoryEl && categoryEl.value) ? categoryEl.value.toString().trim() : '';

    let filtered = allVocabulary.filter(vocab => {
        const matchesSearch = vocab.word.toLowerCase().includes(currentSearch) ||
                            vocab.meaning.toLowerCase().includes(currentSearch) ||
                            vocab.example.toLowerCase().includes(currentSearch);

    const vocabCat = (vocab.category || '').toString().trim();
    const matchesCategory = !currentFilter || vocabCat === currentFilter;

        return matchesSearch && matchesCategory;
    });

    // If level filtering is available (settings.js), apply it so displayed words respect the user's level
    if (typeof filterByUserLevel === 'function') {
        try {
            filtered = filterByUserLevel(filtered);
        } catch (e) {
            console.error('Error applying level filter:', e);
        }
    }

    displayVocabulary(filtered);
}

// Actualizar estadísticas
function updateStats() {
    const total = allVocabulary.length;
    const studied = studiedWords.size;
    const percentage = ((studied / total) * 100).toFixed(1);
    
    const studiedEl = document.getElementById('studiedWords');
    const totalEl = document.getElementById('totalWords');
    const percentEl = document.getElementById('progressPercent');
    if (studiedEl) studiedEl.textContent = studied;
    if (totalEl) totalEl.textContent = total;
    if (percentEl) percentEl.textContent = percentage + '%';
}
// Note: tab navigation is handled centrally in teacher-ui.js to avoid duplicate handlers

// Inicializar tab de examen
function initExamTab() {
    const container = document.getElementById('examContainer');
    if (!container) {
        console.warn('initExamTab: #examContainer not found');
        return;
    }
    if (container.innerHTML === '') {
        container.innerHTML = '<p>Selecciona un tipo de examen para comenzar.</p>';
    }
}

// Función para cambiar tipo de examen
// Función para cambiar tipo de examen
function startExamType(type, btn) {
    const buttons = document.querySelectorAll('.exam-type-btn');
    buttons.forEach(b => b.classList.remove('active'));
    try {
        if (btn && btn.classList) btn.classList.add('active');
    } catch (e) {
        console.error('Error setting active exam button', e);
    }
    startExam(type);
}

// Event listeners
const searchEl = document.getElementById('searchInput');
const categoryEl = document.getElementById('categoryFilter');
if (searchEl) searchEl.addEventListener('input', filterVocabulary);
if (categoryEl) categoryEl.addEventListener('change', filterVocabulary);

// Inicializar
loadStudiedWords();
// Use the main filter pipeline on load so level settings are applied immediately
filterVocabulary();
updateStats();

