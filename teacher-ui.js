// ===== FUNCIONES DE INTEGRACIÓN CON PROFESOR IA =====

// Global API lock to avoid concurrent requests that trigger rate limits
let apiRequestInProgress = false;

function setTeacherButtonsDisabled(disabled) {
    const btns = document.querySelectorAll('.teacher-btn');
    btns.forEach(b => { try { b.disabled = disabled; } catch (e) {} });
}

function showApiBusyMessage(outputEl, msg) {
    if (!outputEl) return;
    outputEl.innerHTML = `<p style="color: var(--warning-color);">${msg}</p>`;
}

// Función para abrir diferentes módulos del profesor
function openTeacherChat() {
    document.querySelectorAll('.teacher-module').forEach(m => m.style.display = 'none');
    document.getElementById('teacherChat').style.display = 'block';
}

function openGenerateStory() {
    document.querySelectorAll('.teacher-module').forEach(m => m.style.display = 'none');
    document.getElementById('storyGenerator').style.display = 'block';
}

function openGenerateDialogue() {
    document.querySelectorAll('.teacher-module').forEach(m => m.style.display = 'none');
    document.getElementById('dialogueGenerator').style.display = 'block';
}

function openGenerateVocab() {
    document.querySelectorAll('.teacher-module').forEach(m => m.style.display = 'none');
    const el = document.getElementById('vocabGenerator');
    if (el) el.style.display = 'block';
}

function openGenerateExam() {
    document.querySelectorAll('.teacher-module').forEach(m => m.style.display = 'none');
    const el = document.getElementById('examGenerator');
    if (el) el.style.display = 'block';
}

function openWordExplanation() {
    document.querySelectorAll('.teacher-module').forEach(m => m.style.display = 'none');
    document.getElementById('wordExplainer').style.display = 'block';
}

function analyzeMyLevel() {
    document.querySelectorAll('.teacher-module').forEach(m => m.style.display = 'none');
    document.getElementById('levelAnalysis').style.display = 'block';
}

// On load, show the active level in the header if available
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (typeof getActiveUserLevel === 'function') {
            const el = document.getElementById('activeLevel');
            if (el) el.textContent = getActiveUserLevel();
        }
    } catch (e) {
        console.error('Error updating active level display on load', e);
    }
});

// Chat con el profesor
async function sendTeacherMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatWindow = document.getElementById('chatMessages');
    
    // Agregar mensaje del usuario
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `<strong>Tú:</strong> ${message}`;
    chatWindow.appendChild(userMsg);
    
    input.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    // Agregar indicador de carga
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'chat-message loading';
    loadingMsg.innerHTML = '<div class="loading-spinner"></div> Profesor pensando...';
    chatWindow.appendChild(loadingMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    // Obtener respuesta del profesor
    try {
        const response = await chatWithTeacher(message);
        chatWindow.removeChild(loadingMsg);
        
        const assistantMsg = document.createElement('div');
        assistantMsg.className = 'chat-message assistant';
        assistantMsg.innerHTML = `<strong>Profesor IA:</strong> ${response}`;
        chatWindow.appendChild(assistantMsg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    } catch (error) {
        chatWindow.removeChild(loadingMsg);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'chat-message assistant';
        errorMsg.innerHTML = '<strong>Error:</strong> No se pudo conectar con el servidor. Verifica tu conexión.';
        chatWindow.appendChild(errorMsg);
    }
}

// Generar historia con IA
async function aiGenerateStory() {
    const theme = document.getElementById('storyTheme').value.trim();
    if (!theme) {
        alert('Por favor ingresa un tema para la historia');
        return;
    }
    
    const output = document.getElementById('generatedStory');
    output.innerHTML = '<div class="loading-spinner"></div> Generando historia épica...';
    
    try {
        console.log('🎬 Generando historia con tema:', theme);
        const story = await generateMiniStory(theme);
        
        // Verificar si hay error en la respuesta
        if (story && story.includes('Error')) {
            console.error('❌ Error en respuesta:', story);
            output.innerHTML = `<p style="color: var(--danger-color);">⚠️ ${story}</p>`;
            return;
        }
        
        if (!story || story.trim() === '') {
            output.innerHTML = '<p style="color: var(--danger-color);">❌ La IA no generó contenido. Intenta con otro tema.</p>';
            return;
        }
        
        console.log('✅ Historia generada:', story.substring(0, 100) + '...');
        
        output.innerHTML = `
            <div style="background: rgba(0, 255, 136, 0.1); padding: 15px; border-radius: 5px; border-left: 3px solid var(--success-color);">
                <strong style="color: var(--success-color);">✨ Historia Generada:</strong>
                <p style="margin-top: 10px; color: var(--text-color); line-height: 1.6; white-space: pre-wrap;">${story}</p>
            </div>
        `;
    } catch (error) {
        console.error('❌ Excepción al generar:', error.message);
        output.innerHTML = `<p style="color: var(--danger-color);">❌ Error: ${error.message || 'No se pudo generar la historia'}</p>`;
    }
}

// Generar vocabulario con IA (UI handler)
async function aiGenerateVocab() {
    const output = document.getElementById('genVocabOutput');
    const count = Number(document.getElementById('genVocabCount').value || 20);
    const level = document.getElementById('genVocabLevel').value || 'B1';
    const catsRaw = document.getElementById('genVocabCats') ? document.getElementById('genVocabCats').value : '';
    const categories = catsRaw ? catsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    // Prevent concurrent API requests
    if (apiRequestInProgress) {
        showApiBusyMessage(output, 'Otra petición está en curso. Espera unos segundos e intenta de nuevo.');
        return;
    }
    apiRequestInProgress = true;
    setTeacherButtonsDisabled(true);
    output.innerHTML = '<div class="loading-spinner"></div> Generando vocabulario...';

    try {
        const res = await generateVocabularyBatch(count, level, categories);
        if (!res || !res.success) {
            const errText = res && res.error ? res.error : 'No se pudo generar vocabulario';
            if (String(errText).includes('429') || String(errText).toLowerCase().includes('resource exhausted')) {
                output.innerHTML = `<p style="color: var(--danger-color);">Límite alcanzado en la API. Intenta de nuevo más tarde.</p>`;
            } else {
                output.innerHTML = `<p style="color: var(--danger-color);">Error: ${errText}</p>`;
            }
            return;
        }

        const items = res.items || [];
        output.innerHTML = `<p style="color: var(--success-color);">✅ Se generaron ${res.added} palabras y se añadieron al corpus.</p>`;
        const list = document.createElement('div');
        list.style.maxHeight = '240px';
        list.style.overflow = 'auto';
        items.forEach(it => {
            const div = document.createElement('div');
            div.style.padding = '6px 0';
            div.innerHTML = `<strong>${it.word}</strong> <em>${it.pronunciation || ''}</em> — ${it.meaning || ''} <div style="font-size:0.9em; opacity:0.9;">${it.example || ''}</div>`;
            list.appendChild(div);
        });
        output.appendChild(list);

        // Update UI stats if present
        try { document.getElementById('totalWords').textContent = allVocabulary.length; } catch(e){}
    } catch (e) {
        console.error('aiGenerateVocab error', e);
        output.innerHTML = `<p style="color: var(--danger-color);">Excepción: ${e.message}</p>`;
    } finally {
        apiRequestInProgress = false;
        setTeacherButtonsDisabled(false);
    }
}

// Generar exámenes con IA (UI handler)
async function aiGenerateExams() {
    const output = document.getElementById('genExamOutput');
    const count = Number(document.getElementById('genExamCount').value || 5);
    const level = document.getElementById('genExamLevel').value || 'B1';

    output.innerHTML = '<div class="loading-spinner"></div> Generando exámenes...';
    try {
        const res = await generateExamScenarios(count, level);
        if (!res || !res.success) {
            output.innerHTML = `<p style="color: var(--danger-color);">Error: ${res && res.error ? res.error : 'No se pudo generar exámenes'}</p>`;
            return;
        }
        const items = res.items || [];
        output.innerHTML = `<p style="color: var(--success-color);">✅ Se generaron ${res.added} escenarios de examen y se añadieron.</p>`;
        const list = document.createElement('div');
        list.style.maxHeight = '240px';
        list.style.overflow = 'auto';
        items.forEach((it, idx) => {
            const div = document.createElement('div');
            div.style.padding = '6px 0';
            div.innerHTML = `<strong>${idx+1}. ${it.title || it.type}</strong> <div style="font-size:0.9em; opacity:0.9;">Tipo: ${it.type || 'n/a'}</div>`;
            list.appendChild(div);
        });
        output.appendChild(list);
    } catch (e) {
        console.error('aiGenerateExams error', e);
        output.innerHTML = `<p style="color: var(--danger-color);">Excepción: ${e.message}</p>`;
    }
}

// Generar diálogo con IA
async function aiGenerateDialogue() {
    const npcType = document.getElementById('npcType').value;
    const output = document.getElementById('generatedDialogue');
    output.innerHTML = '<div class="loading-spinner"></div> Generando diálogo...';
    
    try {
        console.log('💬 Generando diálogo con:', npcType);
        const dialogue = await generateGameDialogue(npcType);
        
        // Verificar si hay error
        if (dialogue && dialogue.includes('Error')) {
            console.error('❌ Error en respuesta:', dialogue);
            output.innerHTML = `<p style="color: var(--danger-color);">⚠️ ${dialogue}</p>`;
            return;
        }
        
        if (!dialogue || dialogue.trim() === '') {
            output.innerHTML = '<p style="color: var(--danger-color);">❌ El diálogo no pudo ser generado. Intenta de nuevo.</p>';
            return;
        }
        
        console.log('✅ Diálogo generado:', dialogue.substring(0, 100) + '...');
        
        output.innerHTML = `
            <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 5px; border-left: 3px solid var(--accent-color);">
                <strong style="color: var(--accent-color);">💬 Diálogo Generado:</strong>
                <p style="margin-top: 10px; color: var(--text-color); line-height: 1.6; white-space: pre-wrap;">${dialogue}</p>
            </div>
        `;
    } catch (error) {
        console.error('❌ Excepción al generar:', error.message);
        output.innerHTML = `<p style="color: var(--danger-color);">❌ Error: ${error.message || 'No se pudo generar el diálogo'}</p>`;
    }
}

// Explicar palabra con IA
async function aiExplainWord() {
    const word = document.getElementById('wordToExplain').value.trim();
    if (!word) {
        alert('Por favor ingresa una palabra');
        return;
    }
    
    const output = document.getElementById('wordExplanation');
    output.innerHTML = '<div class="loading-spinner"></div> Analizando palabra...';
    
    try {
        console.log('📖 Explicando palabra:', word);
        const explanation = await getTeacherExplanation(word);
        
        // Verificar si hay error
        if (explanation && explanation.includes('Error')) {
            console.error('❌ Error en respuesta:', explanation);
            output.innerHTML = `<p style="color: var(--danger-color);">⚠️ ${explanation}</p>`;
            return;
        }
        
        if (!explanation || explanation.trim() === '') {
            output.innerHTML = '<p style="color: var(--danger-color);">❌ No se pudo obtener explicación. Intenta con otra palabra.</p>';
            return;
        }
        
        console.log('✅ Explicación generada:', explanation.substring(0, 100) + '...');
        
        output.innerHTML = `
            <div style="background: rgba(255, 0, 110, 0.1); padding: 15px; border-radius: 5px; border-left: 3px solid var(--danger-color);">
                <strong style="color: var(--danger-color);">📖 Explicación de "${word}":</strong>
                <p style="margin-top: 10px; color: var(--text-color); line-height: 1.6; white-space: pre-wrap;">${explanation}</p>
            </div>
        `;
    } catch (error) {
        console.error('❌ Excepción al explicar:', error.message);
        output.innerHTML = `<p style="color: var(--danger-color);">❌ Error: ${error.message || 'No se pudo explicar la palabra'}</p>`;
    }
}

// Analizar nivel del estudiante
async function aiAnalyzeLevel() {
    const output = document.getElementById('analysisResult');
    output.innerHTML = '<div class="loading-spinner"></div> Analizando tu nivel...';
    
    const stats = getCategoryStats();
    const total = allVocabulary.length;
    const studied = studiedWords.size;
    
    try {
        console.log('📊 Analizando nivel. Estudiadas:', studied, 'de', total);
        const analysis = await analyzeStudentLevel(studied, total, stats);
        
        // Verificar si hay error
        if (analysis && analysis.includes('Error')) {
            console.error('❌ Error en respuesta:', analysis);
            output.innerHTML = `<p style="color: var(--danger-color);">⚠️ ${analysis}</p>`;
            return;
        }
        
        if (!analysis || analysis.trim() === '') {
            output.innerHTML = '<p style="color: var(--danger-color);">❌ No se pudo analizar tu nivel. Intenta de nuevo.</p>';
            return;
        }
        
        console.log('✅ Análisis completado');
        
        output.innerHTML = `
            <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 5px; border-left: 3px solid var(--accent-color);">
                <strong style="color: var(--accent-color);">📊 Análisis de Nivel:</strong>
                <p style="margin-top: 10px; color: var(--text-color); line-height: 1.6; white-space: pre-wrap;">${analysis}</p>
            </div>
        `;
    } catch (error) {
        console.error('❌ Excepción al analizar:', error.message);
        output.innerHTML = `<p style="color: var(--danger-color);">❌ Error: ${error.message || 'No se pudo analizar tu nivel'}</p>`;
    }
}

// ===== FUNCIONES PARA HISTORIAS Y DIÁLOGOS =====

// Cargar historias en el tab
function loadStoriesTab() {
    const container = document.getElementById('storiesGrid');
    container.innerHTML = '';
    
    miniStories.forEach(story => {
        const card = document.createElement('div');
        card.className = 'story-card';
        const preview = story.story.substring(0, 100) + '...';
        
        card.innerHTML = `
            <div class="story-title">${story.title}</div>
            <div class="story-difficulty">Nivel: ${story.difficulty}</div>
            <div class="story-preview">${preview}</div>
            <button class="btn-submit" onclick="displayMiniStory(${story.id})" style="width: 100%; margin-top: 10px;">
                Leer Historia →
            </button>
        `;
        
        container.appendChild(card);
    });
}

// Cargar diálogos en el tab
function loadDialoguesTab() {
    const container = document.getElementById('dialoguesGrid');
    container.innerHTML = '';
    
    expandedDialogues.forEach(dialogue => {
        const card = document.createElement('div');
        card.className = 'dialogue-card';
        
        card.innerHTML = `
            <div class="dialogue-title">${dialogue.title}</div>
            <div class="dialogue-preview"><strong>NPC:</strong> ${dialogue.npc}</div>
            <div class="dialogue-preview">${dialogue.dialogue.length} intercambios</div>
            <button class="btn-submit" onclick="displayDialogue(${dialogue.id})" style="width: 100%; margin-top: 10px;">
                Ver Diálogo →
            </button>
        `;
        
        container.appendChild(card);
    });
}

// ===== INTEGRACIÓN CON TABS =====

// Extender la función de navegación de tabs original
const originalTabNavigation = document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remover activos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar activo
            this.classList.add('active');
            const tabEl = document.getElementById(tabName);
            if (tabEl && tabEl.classList) {
                tabEl.classList.add('active');
            } else {
                console.warn('Tab target not found for data-tab:', tabName);
            }
            
            // Actualizar contenido según tab
            if (tabName === 'stories') {
                loadStoriesTab();
            } else if (tabName === 'dialogues') {
                loadDialoguesTab();
            } else if (tabName === 'recommendations') {
                updateRecommendations();
            } else if (tabName === 'progress') {
                updateProgressTab();
            } else if (tabName === 'exam') {
                initExamTab();
            } else if (tabName === 'teacher') {
                openTeacherChat();
            }
        });
    });
});

// Permitir enter en inputs del profesor
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && document.getElementById('chatInput') === document.activeElement) {
            e.preventDefault();
            sendTeacherMessage();
        }
    });
});
