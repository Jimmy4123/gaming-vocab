// ===== ALGORITMO DE RECOMENDACIONES INTELIGENTES =====

// Almacenar datos de estudio
let studyHistory = JSON.parse(localStorage.getItem('studyHistory')) || {};
let lastStudyDate = localStorage.getItem('lastStudyDate') || null;

// Calcular estadísticas de categoría
function getCategoryStats() {
    const stats = {};
    
    allVocabulary.forEach(word => {
        if (!stats[word.category]) {
            stats[word.category] = {
                total: 0,
                studied: 0,
                lastReviewed: null
            };
        }
        stats[word.category].total++;
        if (studiedWords.has(word.word)) {
            stats[word.category].studied++;
        }
    });
    
    return stats;
}

// Obtener categoría con menor progreso
function getWeakestCategory() {
    const stats = getCategoryStats();
    let weakest = 'general';
    let lowestPercentage = 100;
    
    Object.keys(stats).forEach(category => {
        const percentage = (stats[category].studied / stats[category].total) * 100;
        if (percentage < lowestPercentage) {
            lowestPercentage = percentage;
            weakest = category;
        }
    });
    
    return weakest;
}

// Obtener palabras no estudiadas
function getUnstudiedWords(limit = 10) {
    return allVocabulary.filter(word => !studiedWords.has(word.word)).slice(0, limit);
}

// Algoritmo de priorización de recomendaciones
function getSmartRecommendations(limit = 10) {
    const recommendations = [];
    const weakestCategory = getWeakestCategory();
    // Determine candidate pool based on active user level (if settings available)
    let candidatePool = allVocabulary;
    let coreAllowedSet = null; // strict within-level set
    if (typeof loadUserSettings === 'function') {
        try {
            const s = loadUserSettings();
            const total = allVocabulary.length;
            const level = (typeof getActiveUserLevel === 'function') ? getActiveUserLevel() : s.manualLevel;
            const maxPercent = s.thresholds[level] || 100;
            const maxIndex = Math.floor((maxPercent / 100) * total) - 1;
            const coreSlice = allVocabulary.slice(0, Math.max(0, maxIndex + 1));
            coreAllowedSet = new Set(coreSlice.map(w => w.word));

            // Allow a slightly larger candidate pool (include next level) so recommendations can stretch
            // Find next larger threshold
            const levels = ['A1','A2','B1','B2','C1','C2'];
            const currentIdx = levels.indexOf(level);
            let nextPercent = 100;
            if (currentIdx >= 0 && currentIdx < levels.length - 1) {
                const nextLevel = levels[currentIdx + 1];
                nextPercent = s.thresholds[nextLevel] || 100;
            }
            const nextIndex = Math.floor((nextPercent / 100) * total) - 1;
            const allowedSlice = allVocabulary.slice(0, Math.max(0, nextIndex + 1));
            const allowedSet = new Set(allowedSlice.map(w => w.word));

            candidatePool = allVocabulary.filter(w => allowedSet.has(w.word) || studiedWords.has(w.word));
        } catch (e) {
            console.error('Error reading user settings for recommendations', e);
            candidatePool = allVocabulary;
        }
    } else if (typeof filterByUserLevel === 'function') {
        // Fallback: use the level filter to get allowed candidates
        try {
            candidatePool = filterByUserLevel(allVocabulary);
        } catch (e) {
            console.error('Error applying filterByUserLevel for recommendations', e);
            candidatePool = allVocabulary;
        }
    }

    const unstudied = candidatePool.filter(word => !studiedWords.has(word.word));
    
    // Prioridad 1: Palabras de la categoría débil no estudiadas
    // Prefer high-priority words inside the user's core level
    let weakCategoryWords = unstudied.filter(w => w.category === weakestCategory);
    if (coreAllowedSet) {
        const insideCore = weakCategoryWords.filter(w => coreAllowedSet.has(w.word));
        weakCategoryWords = insideCore.slice(0, Math.ceil(limit * 0.6));
        // If not enough, supplement from outside core but within next-level allowed
        if (weakCategoryWords.length < Math.ceil(limit * 0.6)) {
            const supplement = unstudied.filter(w => w.category === weakestCategory && !coreAllowedSet.has(w.word)).slice(0, Math.ceil(limit * 0.6) - weakCategoryWords.length);
            weakCategoryWords = weakCategoryWords.concat(supplement);
        }
    } else {
        weakCategoryWords = weakCategoryWords.slice(0, Math.ceil(limit * 0.5));
    }
    
    weakCategoryWords.forEach(word => {
        recommendations.push({
            ...word,
            priority: 'high',
            reason: `Necesitas mejorar en ${getCategoryLabel(weakestCategory)}`
        });
    });
    
    // Prioridad 2: Palabras de otras categorías
    // For other words, prefer those inside coreAllowedSet (if defined), then fill with other unstudied
    let otherWords = [];
    if (coreAllowedSet) {
        otherWords = unstudied.filter(w => w.category !== weakestCategory && coreAllowedSet.has(w.word)).slice(0, limit - recommendations.length);
        if (otherWords.length < (limit - recommendations.length)) {
            const needed = (limit - recommendations.length) - otherWords.length;
            const supplement = unstudied.filter(w => w.category !== weakestCategory && !coreAllowedSet.has(w.word)).slice(0, needed);
            otherWords = otherWords.concat(supplement);
        }
    } else {
        otherWords = unstudied.filter(w => w.category !== weakestCategory).slice(0, limit - recommendations.length);
    }
    
    otherWords.forEach(word => {
        recommendations.push({
            ...word,
            priority: 'medium',
            reason: `Palabras nuevas para aprender`
        });
    });
    
    return recommendations.slice(0, limit);
}

// Calcular racha de estudio (días)
function getStudyStreak() {
    if (!lastStudyDate) return 0;
    
    const last = new Date(lastStudyDate);
    const today = new Date();
    const diffTime = today - last;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 1;
    if (diffDays === 1) return 1;
    return 0; // Racha rota
}

// Actualizar última fecha de estudio
function updateLastStudyDate() {
    lastStudyDate = new Date().toISOString();
    localStorage.setItem('lastStudyDate', lastStudyDate);
}

// ===== MÓDULO DE EXÁMENES =====

// Situaciones reales para exámenes
const examScenarios = [
    // Exámenes de Traducción
    {
        type: 'translation',
        title: 'Traducción: Intro a Videojuego',
        text: 'Welcome to the game! Choose your class: warrior, mage, or archer. Defeat enemies to gain experience and level up. Collect items to upgrade your equipment. Save your progress at checkpoints.',
        hint: 'Este es un intro de videojuego típico'
    },
    {
        type: 'translation',
        title: 'Traducción: Tutorial de Combate',
        text: 'Attack your enemies with the left mouse button. Press space to dodge incoming attacks. Use your special ability when the cooldown is ready. Keep your health above zero or you will respawn.',
        hint: 'Instrucciones de un sistema de combate'
    },
    {
        type: 'translation',
        title: 'Traducción: Mensaje de Derrota',
        text: 'Game Over! You have been defeated. Your items have been lost. You will respawn at the last checkpoint. Try again to complete the mission.',
        hint: 'Mensaje de game over'
    },
    {
        type: 'translation',
        title: 'Traducción: Descripción de Objeto',
        text: 'Legendary Sword: Increases damage by 50%. This rare artifact has been passed down through generations. It deals fire damage and can ignore armor. Equip this weapon to boost your attack power.',
        hint: 'Descripción de un arma legendaria'
    },
    {
        type: 'translation',
        title: 'Traducción: Sistema de Crafteo',
        text: 'You have gathered the required materials. Visit the blacksmith to craft a new sword. You need 5 iron ore, 3 gems, and 100 gold coins. The craft will take 24 hours to complete.',
        hint: 'Sistema de fabricación de objetos'
    },
    {
        type: 'translation',
        title: 'Traducción: Diálogo NPC',
        text: 'Merchant: Greetings traveler! I have rare items for sale. You need a key to access the treasure room. The boss has the key. Defeat the boss and return to me.',
        hint: 'Diálogo con un comerciante'
    },
    {
        type: 'translation',
        title: 'Traducción: Quest',
        text: 'New Quest: Gather herbs from the forest. You need 10 healing herbs to complete the potion. Bring them to the alchemist. Reward: 500 experience and a rare potion.',
        hint: 'Descripción de una misión'
    },
    {
        type: 'translation',
        title: 'Traducción: Bonus y Penalizaciones',
        text: 'You received a buff: damage increased by 20% for 30 seconds. Warning: You are under a poison effect. Your health decreases slowly. Find an antidote or visit the priest.',
        hint: 'Sistema de buffs y debuffs'
    },

    // Exámenes de Escucha (requiere pronunciación)
    {
        type: 'listening',
        title: 'Escucha: Instrucción de Combate',
        words: ['attack', 'health', 'dodge', 'damage', 'enemy'],
        question: 'Escucha y escribe las 5 palabras de combate que escuchas'
    },
    {
        type: 'listening',
        title: 'Escucha: Objetos de Juego',
        words: ['sword', 'shield', 'potion', 'gold', 'key'],
        question: 'Escucha y escribe los 5 objetos que menciona'
    },
    {
        type: 'listening',
        title: 'Escucha: Acciones',
        words: ['jump', 'run', 'climb', 'swim', 'fly'],
        question: 'Escucha y escribe los 5 movimientos'
    },

    // Exámenes de Diálogos
    {
        type: 'dialogue',
        title: 'Diálogo: El Comerciante',
        dialogue: [
            { speaker: 'Merchant', text: 'Welcome to my shop. What items do you need?' },
            { speaker: 'You', text: '___________?' },
            { speaker: 'Merchant', text: 'I have potions, weapons, and armor. Do you want to buy anything?' }
        ],
        expectedWords: ['Do you have potions', 'What items', 'How much'],
        hint: 'Pregunta sobre los artículos disponibles'
    },
    {
        type: 'dialogue',
        title: 'Diálogo: El Herrero',
        dialogue: [
            { speaker: 'Blacksmith', text: 'Bring me materials and I will craft you a weapon.' },
            { speaker: 'You', text: '___________?' },
            { speaker: 'Blacksmith', text: 'I need iron ore, gems, and gold. The process takes time.' }
        ],
        expectedWords: ['What materials', 'What do you need', 'How long'],
        hint: 'Pregunta qué materiales necesita'
    },
    {
        type: 'dialogue',
        title: 'Diálogo: La Sacerdotisa',
        dialogue: [
            { speaker: 'Priest', text: 'You look injured. Let me heal you.' },
            { speaker: 'You', text: '___________.' },
            { speaker: 'Priest', text: 'My blessing will restore your health. Go now, the world needs you.' }
        ],
        expectedWords: ['Thank you', 'I appreciate it', 'Thank you so much'],
        hint: 'Expresa gratitud'
    },
    {
        type: 'dialogue',
        title: 'Diálogo: El Sabio',
        dialogue: [
            { speaker: 'Sage', text: 'You seek knowledge? I can teach you ancient secrets.' },
            { speaker: 'You', text: '___________?' },
            { speaker: 'Sage', text: 'First, you must prove yourself. Defeat the guardian and return with proof.' }
        ],
        expectedWords: ['How can', 'What must I do', 'What should I do'],
        hint: 'Pregunta cómo proceder'
    }
];

// Estado actual del examen
let currentExamIndex = 0;
let examAnswers = [];
let examScore = 0;

// Iniciar examen
function startExam(type) {
    const container = document.getElementById('examContainer');
    if (!container) {
        console.warn('startExam: #examContainer not found');
        return;
    }
    const relevantScenarios = examScenarios.filter(s => s.type === type);
    
    if (relevantScenarios.length === 0) {
        container.innerHTML = '<p>No hay exámenes disponibles para este tipo.</p>';
        return;
    }
    
    currentExamIndex = 0;
    examAnswers = [];
    examScore = 0;
    displayExamQuestion(type);
}

// Mostrar pregunta del examen
function displayExamQuestion(type) {
    const container = document.getElementById('examContainer');
    const relevantScenarios = examScenarios.filter(s => s.type === type);
    
    if (currentExamIndex >= relevantScenarios.length) {
        showExamResults(type, relevantScenarios.length);
        return;
    }
    
    const scenario = relevantScenarios[currentExamIndex];
    let html = `<div class="exam-question">`;
    html += `<h3>${scenario.title}</h3>`;
    
    if (type === 'translation') {
        html += `
            <div class="exam-scene">
                <div class="exam-scene-title">📖 Texto en Inglés:</div>
                <div class="exam-scene-text">${scenario.text}</div>
            </div>
            <div class="exam-scene">
                <div class="exam-scene-title">💡 Pista: ${scenario.hint}</div>
            </div>
            <label>Traduce este texto al español:</label>
            <textarea class="exam-input" id="userAnswer" placeholder="Escribe tu traducción aquí..." rows="5"></textarea>
        `;
    } else if (type === 'listening') {
        html += `
            <div class="exam-scene">
                <div class="exam-scene-title">🔊 ${scenario.question}</div>
                <p>Palabras: ${scenario.words.join(', ')}</p>
            </div>
            <button class="btn-submit" onclick="playListeningAudio('${scenario.words.join(',')}')">🔊 Reproducir Audio</button>
            <label>Escribe lo que escuchaste:</label>
            <input type="text" class="exam-input" id="userAnswer" placeholder="Escribe las palabras separadas por comas..." />
        `;
    } else if (type === 'dialogue') {
        html += `<div class="exam-scene">`;
        let youIndex = 0;
        scenario.dialogue.forEach(line => {
            if (line.speaker === 'You') {
                // multiple inputs get unique ids and a shared class for retrieval
                html += `
                    <p><strong>${line.speaker}:</strong> <input type="text" class="exam-input dialogue-answer" id="userAnswer_${youIndex}" data-idx="${youIndex}" placeholder="Tu respuesta..." /></p>
                `;
                youIndex++;
            } else {
                html += `<p><strong>${line.speaker}:</strong> ${line.text}</p>`;
            }
        });
        html += `<p><strong>Pista:</strong> ${scenario.hint}</p>`;
        html += `</div>`;
    }
    
    html += `
        <div class="exam-buttons">
            <button class="btn-submit" onclick="submitAnswer('${type}')">✓ Verificar</button>
            <button class="btn-skip" onclick="skipQuestion('${type}')">⏭️ Saltar</button>
        </div>
    </div>`;
    
    container.innerHTML = html;
    updateLastStudyDate();
}

// Enviar respuesta
function submitAnswer(type) {
    // Safely read user answer(s) depending on exam type
    let userAnswer = '';
    if (type === 'dialogue') {
        const inputs = Array.from(document.querySelectorAll('.dialogue-answer'));
        userAnswer = inputs.map(i => (i.value || '').trim()).filter(Boolean).join(' ');
    } else {
        const uaEl = document.getElementById('userAnswer');
        userAnswer = (uaEl && uaEl.value) ? uaEl.value.trim() : '';
    }
    const relevantScenarios = examScenarios.filter(s => s.type === type);
    const scenario = relevantScenarios[currentExamIndex];
    
    let isCorrect = false;
    let feedback = '';
    
    if (type === 'translation') {
        // Evaluación simple: si escribió algo, le damos feedback
        if (userAnswer.length > 20) {
            isCorrect = true;
            feedback = '✓ Buena traducción. Recuerda que no hay traducción perfecta, pero capturaste la idea.';
        } else {
            feedback = '✗ Tu traducción es muy corta. Intenta traducir más completo.';
        }
    } else if (type === 'listening') {
        // Verificar palabras
        const expectedWords = scenario.words.map(w => w.toLowerCase());
        const userWords = userAnswer.toLowerCase().split(',').map(w => w.trim());
        const matches = userWords.filter(w => expectedWords.includes(w)).length;
        isCorrect = matches >= expectedWords.length * 0.6;
        feedback = `Encontraste ${matches}/${expectedWords.length} palabras. ${isCorrect ? '¡Bien hecho!' : 'Intenta de nuevo.'}`;
    } else if (type === 'dialogue') {
        // Verificar si contiene palabras clave
        const anyMatch = scenario.expectedWords.some(expected => 
            userAnswer.toLowerCase().includes(expected.toLowerCase())
        );
        isCorrect = anyMatch && userAnswer.length > 5;
        feedback = isCorrect ? '✓ ¡Buena respuesta!' : '✗ Tu respuesta no es clara. Intenta de nuevo.';
    }
    
    examAnswers.push({
        question: scenario.title,
        userAnswer,
        isCorrect
    });
    
    if (isCorrect) examScore++;
    
    // Mostrar feedback
    const container = document.getElementById('examContainer');
    if (!container) {
        console.warn('submitAnswer: #examContainer not found');
        return;
    }
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `exam-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackDiv.innerHTML = feedback;
    container.appendChild(feedbackDiv);
    
    // Botón para siguiente pregunta
    setTimeout(() => {
        currentExamIndex++;
        displayExamQuestion(type);
    }, 2000);
}

// Saltar pregunta
function skipQuestion(type) {
    examAnswers.push({ question: 'Pregunta saltada', userAnswer: '', isCorrect: false });
    currentExamIndex++;
    displayExamQuestion(type);
}

// Mostrar resultados
function showExamResults(type, total) {
    const container = document.getElementById('examContainer');
    const percentage = (examScore / total) * 100;
    let message = '';
    
    if (percentage === 100) {
        message = '🏆 ¡Perfecto! Dominaste este examen.';
    } else if (percentage >= 80) {
        message = '🎉 ¡Excelente! Vas muy bien.';
    } else if (percentage >= 60) {
        message = '👍 Bien hecho, sigue practicando.';
    } else if (percentage >= 40) {
        message = '📚 Necesitas más práctica.';
    } else {
        message = '💪 Sigue estudiando, mejorarás.';
    }
    
    container.innerHTML = `
        <div class="exam-result">
            <h2>Resultados del Examen</h2>
            <div class="exam-score">${Math.round(percentage)}%</div>
            <p class="exam-completion-message">${examScore} de ${total} respuestas correctas</p>
            <p class="exam-completion-message">${message}</p>
            <button class="btn-submit" onclick="location.reload()">🔄 Hacer otro examen</button>
        </div>
    `;
}

// Reproducir audio para exámenes de listening
function playListeningAudio(words) {
    const wordList = words.split(',').map(w => w.trim());
    const utterances = [];
    
    wordList.forEach(word => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterances.push(utterance);
    });
    
    // Reproducir secuencialmente
    let index = 0;
    function playNext() {
        if (index < utterances.length) {
            window.speechSynthesis.speak(utterances[index]);
            utterances[index].onend = () => {
                index++;
                setTimeout(playNext, 500);
            };
        }
    }
    
    playNext();
}

// Actualizar recomendaciones
function updateRecommendations() {
    const container = document.getElementById('recommendationsContainer');
    const recommendations = getSmartRecommendations(10);
    const weakest = getWeakestCategory();
    const unstudiedCount = allVocabulary.length - studiedWords.size;
    const streak = getStudyStreak();
    
    const unstudiedEl = document.getElementById('unstudiedCount');
    const streakEl = document.getElementById('streak');
    const weakCatEl = document.getElementById('weakCategory');
    if (unstudiedEl) unstudiedEl.textContent = unstudiedCount;
    if (streakEl) streakEl.textContent = streak + ' días';
    if (weakCatEl) weakCatEl.textContent = getCategoryLabel(weakest);
    // Show active level indicator if available in DOM
    try {
        if (typeof getActiveUserLevel === 'function') {
            const active = getActiveUserLevel();
            const el = document.getElementById('activeLevel');
            if (el) el.textContent = active;
        }
    } catch (e) {
        console.error('Error getting active user level for display', e);
    }
    
    container.innerHTML = '';
    
    if (recommendations.length === 0) {
        container.innerHTML = '<div class="no-results">¡Felicidades! Ya estudiaste todas las palabras. 🎓</div>';
        return;
    }
    
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <div class="recommendation-priority ${rec.priority}">${rec.priority.toUpperCase()}</div>
            <div class="word">${rec.word}</div>
            <div class="pronunciation">${rec.pronunciation}</div>
            <div class="meaning">
                <div class="meaning-label">Significado:</div>
                <div class="meaning-text">${rec.meaning}</div>
            </div>
            <div class="example">
                <div class="example-label">Ejemplo:</div>
                <div class="example-text">"${rec.example}"</div>
            </div>
            <p style="color: var(--success-color); margin-top: 10px; font-size: 0.9em;">💡 ${rec.reason}</p>
            <button class="mark-studied" onclick="toggleStudied('${rec.word}', this); updateRecommendations()">
                Marcar como estudiada
            </button>
        `;
        container.appendChild(card);
    });
}

// Actualizar progreso general
function updateProgressTab() {
    const totalWords = allVocabulary.length;
    const studiedWordsCount = studiedWords.size;
    const percentage = (studiedWordsCount / totalWords) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        progressFill.textContent = Math.round(percentage) + '%';
    }
    if (progressText) progressText.textContent = `${studiedWordsCount} / ${totalWords} palabras estudiadas`;

    // Progreso por categoría
    const categoryProgressList = document.getElementById('categoryProgressList');
    const stats = getCategoryStats();
    if (categoryProgressList) categoryProgressList.innerHTML = '';
    
    Object.keys(stats).forEach(category => {
        const stat = stats[category];
        const categoryPercentage = (stat.studied / stat.total) * 100;
        const categoryLabel = getCategoryLabel(category);
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        categoryDiv.innerHTML = `
            <div class="category-name">${categoryLabel}</div>
            <div class="category-bar">
                <div class="category-fill" style="width: ${categoryPercentage}%">${Math.round(categoryPercentage)}%</div>
            </div>
            <p style="font-size: 0.9em; color: var(--text-color); margin-top: 5px;">${stat.studied}/${stat.total}</p>
        `;
        if (categoryProgressList) categoryProgressList.appendChild(categoryDiv);
    });
}

// Reiniciar progreso
function resetProgress() {
    if (confirm('¿Estás seguro de que quieres reiniciar tu progreso? Esta acción no se puede deshacer.')) {
        localStorage.clear();
        studiedWords.clear();
        studyHistory = {};
        location.reload();
    }
}
