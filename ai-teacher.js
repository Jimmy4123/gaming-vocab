// ===== PROFESOR DE IA - GEMINI 2.5 FLASH =====

let aiChatHistory = [];
const MAX_CHAT_HISTORY = 10;

// Sistema de prompts del profesor
const TEACHER_SYSTEM_PROMPT = `Eres un profesor de inglés especializado en vocabulario de videojuegos.
Tu objetivo es ayudar a estudiantes a aprender vocabulario gaming en inglés (US English) de forma interactiva y divertida.

Instrucciones:
1. Responde SIEMPRE en español para explicaciones, pero usa inglés para ejemplos.
2. Sé amable, motivador y paciente.
3. Usa emojis para hacer las respuestas más atractivas.
4. Proporciona ejemplos de contextos de videojuegos (usa inglés de EEUU en los ejemplos).
5. Si el estudiante pregunta sobre una palabra, explica:
    - Pronunciación (US English). Cuando sea posible, incluye guía IPA corta y una guía de pronunciación simple.
    - Significado
    - Contextos donde se usa
    - Similares o relacionadas
6. Mantén respuestas concisas (máximo 150 palabras).
7. Sugiere ejercicios prácticos cuando sea apropiado.`;

const STORY_SYSTEM_PROMPT = `Eres un narrador de historias épicas de videojuegos en inglés (US English).
Tu objetivo es crear mini historias cortas y emocionantes que usen vocabulario gaming común.

Instrucciones:
1. Escribe historias en inglés simple pero interesante (usa US English spelling/phrasing).
2. Usa 100-150 palabras (ajustable por nivel cuando se indique).
3. Incluye al menos 5-10 palabras de vocabulario gaming.
4. El nivel debe ser intermedio (B1) por defecto.
5. Añade después de la historia: "Palabras clave:" con las palabras difíciles.
6. Usa emojis para dramatización.`;

const DIALOGUE_SYSTEM_PROMPT = `Eres un escritor de diálogos de videojuegos educativos en inglés (US English).
Tu tarea es crear diálogos realistas entre NPCs y jugadores.

Instrucciones:
1. Crea diálogos en inglés (usa US English)
2. Incluye al menos 2-3 intercambios
3. Usa vocabulario gaming apropiado
4. Nivel B1 (intermedio) por defecto
5. Añade traducción en español debajo
6. Formato: NPC: "texto" / Player: "texto"`;

// Agregar mensaje al historial
function addToChat(role, message) {
    aiChatHistory.push({ role, message });
    if (aiChatHistory.length > MAX_CHAT_HISTORY) {
        aiChatHistory.shift();
    }
}

// Obtener nivel objetivo (CEFR) desde settings, con fallback
function getTargetLevel() {
    try {
        if (typeof getActiveUserLevel === 'function') {
            return getActiveUserLevel();
        }
    } catch (e) {
        console.error('Error obtaining active user level:', e);
    }
    return 'B1';
}

// Obtener contexto del historial
function getChatContext() {
    return aiChatHistory.map(msg => `${msg.role}: ${msg.message}`).join('\n');
}

// Función: Obtener explicación de una palabra del profesor
async function getTeacherExplanation(word) {
    const level = getTargetLevel();
    const prompt = `Explica la siguiente palabra de videojuegos: "${word}"

    Nivel del estudiante: ${level}
    Proporciona (adecuando la explicación al nivel):
    1. Significado exacto
    2. Cómo se pronuncia (con guía sencilla)
    3. Un ejemplo en contexto de videojuego
    4. Palabras relacionadas

    Sé conciso pero completo.`;

    // Attach level hint to system prompt so the model generates appropriate difficulty
    const sys = TEACHER_SYSTEM_PROMPT + `\nNivel objetivo: ${level}`;
    const response = await callGeminiAPI(prompt, sys);
    addToChat('assistant', response);
    return response;
}

// Función: Chat libre con el profesor
async function chatWithTeacher(userMessage) {
    addToChat('user', userMessage);
    
    const context = getChatContext();
    const prompt = `Conversación anterior:\n${context}\n\nResponde al último mensaje del usuario de manera amable y educativa sobre vocabulario gaming.`;
    
    const response = await callGeminiAPI(prompt, TEACHER_SYSTEM_PROMPT);
    addToChat('assistant', response);
    return response;
}

// Función: Generar mini historia
async function generateMiniStory(theme = 'aventura') {
    const level = getTargetLevel();
    // Adjust target length and complexity by level
    let wordMin = 80, wordMax = 150;
    if (level === 'A1') { wordMin = 40; wordMax = 80; }
    else if (level === 'A2') { wordMin = 60; wordMax = 100; }
    else if (level === 'B2') { wordMin = 100; wordMax = 160; }
    else if (level === 'C1' || level === 'C2') { wordMin = 120; wordMax = 200; }

    const prompt = `Crea una mini historia épica sobre un tema de videojuegos: "${theme}"

    Nivel objetivo: ${level}
    La historia debe:
    - Tener entre ${wordMin}-${wordMax} palabras
    - Usar vocabulario gaming común apropiado al nivel
    - Ser emocionante y entretenida
    - Incluir acción y diálogos cortos
    - Al final, incluye 'Palabras clave:' con las palabras difíciles`;

    const sys = STORY_SYSTEM_PROMPT + `\nNivel objetivo: ${level}`;
    const response = await callGeminiAPI(prompt, sys);
    return response;
}

// Función: Generar diálogo interactivo
async function generateGameDialogue(npcType = 'merchant') {
    const level = getTargetLevel();
    const prompt = `Crea un diálogo de videojuego realista con un ${npcType}.

    Nivel objetivo: ${level}
    Requisitos:
    - 2-4 intercambios (ajusta la complejidad al nivel)
    - Inglés simple pero natural
    - Vocabulario gaming apropiado al nivel
    - Incluye traducción al español`;

    const sys = DIALOGUE_SYSTEM_PROMPT + `\nNivel objetivo: ${level}`;
    const response = await callGeminiAPI(prompt, sys);
    return response;
}

// Función: Corregir respuesta del usuario
async function checkUserAnswer(userAnswer, question, correctAnswer) {
    const prompt = `Evalúa la respuesta del estudiante:
    
    Pregunta: "${question}"
    Respuesta del estudiante: "${userAnswer}"
    Respuesta correcta: "${correctAnswer}"
    
    Proporciona:
    1. Si es correcta (✓) o incorrecta (✗)
    2. Explicación breve
    3. Una sugerencia de mejora
    
    Sé motivador aunque sea incorrecta.`;
    
    const response = await callGeminiAPI(prompt, TEACHER_SYSTEM_PROMPT);
    return response;
}

// Función: Generar ejercicios personalizados
async function generateExercise(category, difficulty = 'intermediate') {
    // If difficulty not provided, infer from user's CEFR level
    const level = getTargetLevel();
    const levelMap = {
        'A1': 'beginner',
        'A2': 'elementary',
        'B1': 'intermediate',
        'B2': 'upper-intermediate',
        'C1': 'advanced',
        'C2': 'advanced'
    };
    const finalDifficulty = difficulty || levelMap[level] || 'intermediate';

    const prompt = `Crea un ejercicio de inglés sobre vocabulario gaming de la categoría: "${category}"

    Nivel objetivo (CEFR): ${level}
    Dificultad solicitada: ${finalDifficulty}
    Formato:
    1. Pregunta/Instrucción
    2. 4 opciones (A, B, C, D)
    3. Respuesta correcta
    4. Explicación

    El ejercicio debe ser práctico y relevante.`;

    const sys = TEACHER_SYSTEM_PROMPT + `\nNivel objetivo: ${level}`;
    const response = await callGeminiAPI(prompt, sys);
    return response;
}

// Función: Analizar nivel del estudiante
async function analyzeStudentLevel(studiedWords, totalWords, categoryStats) {
    const percentageStudied = ((studiedWords / totalWords) * 100).toFixed(1);
    
    const prompt = `Un estudiante ha estudiado ${percentageStudied}% del vocabulario (${studiedWords}/${totalWords} palabras).
    
    Estadísticas por categoría: ${JSON.stringify(categoryStats)}
    
    Proporciona:
    1. Nivel actual (Beginner/Intermediate/Advanced)
    2. Fortalezas
    3. Áreas de mejora
    4. 3 recomendaciones específicas
    
    Sé motivador y constructivo.`;
    
    const response = await callGeminiAPI(prompt, TEACHER_SYSTEM_PROMPT);
    return response;
}

// Función: Generar juego de palabras
async function generateWordGame(type = 'matching') {
    const prompt = `Crea un juego de palabras tipo "${type}" con vocabulario gaming en inglés.
    
    Incluye:
    - Palabras o conceptos a vincular
    - Instrucciones claras
    - Nivel intermedio
    - 5-6 pares/elementos`;
    
    const response = await callGeminiAPI(prompt, TEACHER_SYSTEM_PROMPT);
    return response;
}

// Función: Sugerir siguiente palabra basado en IA
async function suggestNextWord(studiedWords, remainingWords) {
    const level = getTargetLevel();
    const wordList = remainingWords.slice(0, 10).map(w => w.word).join(', ');

    const prompt = `El estudiante ha estudiado: ${studiedWords.slice(0, 5).join(', ')}...

    Nivel del estudiante: ${level}
    Palabras disponibles: ${wordList}...

    ¿Cuál sería la próxima palabra más útil y relevante para aprender para un estudiante de nivel ${level}? 
    Explica por qué es importante esta palabra en contexto de videojuegos y sugiere un ejercicio corto.`;

    const sys = TEACHER_SYSTEM_PROMPT + `\nNivel objetivo: ${level}`;
    const response = await callGeminiAPI(prompt, sys);
    return response;
}

// ------------------------------
// Generación dinámica de vocabulario por IA
// ------------------------------
// Solicita a la IA crear una lista JSON de palabras de vocabulario gaming.
// Cada entrada debe tener: word, pronunciation (IPA US), meaning (es), example (en), category
async function generateVocabularyBatch(count = 20, level = 'B1', categories = []) {
    // sanitize inputs
    count = Math.max(1, Math.min(100, Number(count) || 20));
    const catText = (Array.isArray(categories) && categories.length) ? `, categorías: ${categories.join(', ')}` : '';

    const prompt = `Genera una lista JSON con ${count} palabras de vocabulario de videojuegos apropiadas para nivel ${level}${catText}.` +
    ` Devuelve UNICAMENTE un array JSON. Cada elemento debe ser un objeto con las siguientes claves:` +
    ` word (string), pronunciation (IPA - US), meaning (en español breve), example (una frase en inglés, contexto de videojuego), category (una de: combat,movement,items,game-mechanics,interface,npcs,environment,advanced,general).` +
    ` Asegúrate de que el JSON sea válido y no incluyas explicaciones adicionales.`;

    try {
        const sys = TEACHER_SYSTEM_PROMPT + `\nGenerar vocabulario: nivel ${level}`;
        let raw = await callGeminiAPI(prompt, sys);
        // If callGeminiAPI returned an Error string, surface that
        if (typeof raw === 'string' && raw.startsWith('Error:')) {
            console.error('generateVocabularyBatch: callGeminiAPI error:', raw);
            return { success: false, error: raw };
        }

        // Try to extract JSON from response; if not found, attempt up to 2 reprompts
        let jsonText = extractJSON(raw);
        let attempts = 0;
        while (!jsonText && attempts < 2) {
            attempts++;
            console.warn(`generateVocabularyBatch: JSON not found on attempt ${attempts}, reprompting model for clean JSON`);
            const schemaHint = '{word, pronunciation, meaning, example, category} (array)';
            const repaired = await repromptForJSON(raw, schemaHint);
            if (repaired) {
                jsonText = repaired;
                break;
            }
            // If reprompt returned null, include original raw in logs and break
            console.error('generateVocabularyBatch: reprompt did not return valid JSON. Raw (truncated):', (raw && raw.toString().substring(0,1000)) || raw);
            // as a last resort, try calling API again fresh
            raw = await callGeminiAPI(prompt + '\nPor favor responde SOLO con el JSON solicitado.', sys);
            if (typeof raw === 'string' && raw.startsWith('Error:')) break;
            jsonText = extractJSON(raw);
        }

        if (!jsonText) {
            console.error('generateVocabularyBatch: raw response (truncated):', (raw && raw.toString().substring(0,1000)) || raw);
            throw new Error('No se encontró JSON válido en la respuesta de la IA');
        }
        const parsed = JSON.parse(jsonText);

        // If the model returned an object, try to find the array inside common keys
        let parsedArray = null;
        if (Array.isArray(parsed)) {
            parsedArray = parsed;
        } else if (parsed && typeof parsed === 'object') {
            // Common candidate keys that might contain the array
            const candidateKeys = ['items', 'vocabulary', 'words', 'data', 'list', 'results'];
            for (const k of candidateKeys) {
                if (Array.isArray(parsed[k])) { parsedArray = parsed[k]; break; }
            }
            // If no common key found, look for first array property
            if (!parsedArray) {
                for (const k in parsed) {
                    if (Array.isArray(parsed[k])) { parsedArray = parsed[k]; break; }
                }
            }
            // If still not found but object looks like a single entry, wrap it
            if (!parsedArray) {
                // If object has keys like word/meaning, wrap into array of one
                if (parsed.word || parsed.meaning || parsed.pronunciation) {
                    parsedArray = [parsed];
                }
            }
        }

        if (!parsedArray) {
            console.error('generateVocabularyBatch: parsed JSON is not an array and no candidate array found. Parsed:', parsed);
            throw new Error('El JSON generado no contiene un array de vocabulario esperado');
        }

        // Validate and normalize entries
        const valid = parsedArray.map(entry => normalizeGeneratedEntry(entry)).filter(Boolean);

        // Persist generated vocabulary
        try {
            const existingRaw = localStorage.getItem('generatedVocabulary');
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            const merged = existing.concat(valid);
            localStorage.setItem('generatedVocabulary', JSON.stringify(merged));
        } catch (e) {
            console.error('Error saving generatedVocabulary', e);
        }

        // Merge into runtime corpus
        try {
            if (Array.isArray(valid) && valid.length) {
                // avoid duplicates by word
                const existingWords = new Set(allVocabulary.map(w => w.word));
                valid.forEach(v => {
                    if (!existingWords.has(v.word)) {
                        allVocabulary.push(v);
                        existingWords.add(v.word);
                    }
                });
            }
        } catch (e) {
            console.error('Error merging generated vocab into allVocabulary', e);
        }

        return { success: true, added: valid.length, items: valid };
    } catch (e) {
        console.error('generateVocabularyBatch error', e);
        return { success: false, error: e.message };
    }
}

// Helper: try to extract JSON substring from a model response
function extractJSON(text) {
    if (!text) return null;
    // If callGeminiAPI returned an Error string, propagate
    if (typeof text === 'string' && text.startsWith('Error:')) {
        console.error('extractJSON: received Error response from callGeminiAPI:', text);
        return null;
    }

    // If it's already an object/array, stringify and return
    if (typeof text !== 'string') {
        try {
            return JSON.stringify(text);
        } catch (e) {
            return null;
        }
    }

    const trimmed = text.trim();

    // If the whole text is valid JSON, return it
    try {
        JSON.parse(trimmed);
        return trimmed;
    } catch (e) {
        // not pure JSON, continue
    }

    // If text contains a ```json code fence, extract content inside
    const fenceMatch = trimmed.match(/```(?:json)?\n([\s\S]*?)\n```/i);
    if (fenceMatch && fenceMatch[1]) {
        const candidate = fenceMatch[1].trim();
        try { JSON.parse(candidate); return candidate; } catch (e) { /* fallthrough */ }
    }

    // Try to extract either an array [...] or object {...} by scanning for matching brackets
    function findMatching(startChar, endChar) {
        const startIdx = trimmed.indexOf(startChar);
        if (startIdx === -1) return null;
        let depth = 0;
        for (let i = startIdx; i < trimmed.length; i++) {
            const ch = trimmed[i];
            if (ch === startChar) depth++;
            else if (ch === endChar) depth--;
            if (depth === 0) {
                const candidate = trimmed.substring(startIdx, i + 1);
                try { JSON.parse(candidate); return candidate; } catch (e) { return null; }
            }
        }
        return null;
    }

    const arrCandidate = findMatching('[', ']');
    if (arrCandidate) return arrCandidate;
    const objCandidate = findMatching('{', '}');
    if (objCandidate) return objCandidate;

    // As last resort, try to locate first '[' and last ']' (legacy fallback)
    const start = trimmed.indexOf('[');
    const end = trimmed.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
        const jsonText = trimmed.substring(start, end + 1);
        try { JSON.parse(jsonText); return jsonText; } catch (e) { /* fallthrough */ }
    }

    return null;
}

// Try to ask the model to reformat a previous response into clean JSON.
// Returns the cleaned JSON text or null.
async function repromptForJSON(rawResponse, hint = '') {
    try {
        if (!rawResponse) return null;
        const safeSnippet = (typeof rawResponse === 'string') ? rawResponse.substring(0, 1200) : JSON.stringify(rawResponse).substring(0,1200);
        const reprompt = `La respuesta anterior del modelo fue:\n\n${safeSnippet}\n\nPor favor, EXTRAe y DEVUELVE SOLO el JSON válido que contiene esa respuesta.` +
            ` Si no puedes extraer JSON válido, responde exactamente: NO_JSON.` +
            (hint ? `\nEsquema esperado: ${hint}` : '') +
            `\nNO añadas texto explicativo ni comentarios adicionales, SOLO el JSON.`;

        const sys = TEACHER_SYSTEM_PROMPT + '\nFormato estricto: devolver SOLO JSON o NO_JSON';
        const repaired = await callGeminiAPI(reprompt, sys);
        if (!repaired) return null;
        if (typeof repaired === 'string' && repaired.trim() === 'NO_JSON') return null;

        const jsonText = extractJSON(repaired);
        return jsonText;
    } catch (e) {
        console.error('repromptForJSON error', e);
        return null;
    }
}

// Helper: validate and normalize a generated entry
function normalizeGeneratedEntry(entry) {
    if (!entry || typeof entry !== 'object') return null;
    const word = (entry.word || entry.term || '').toString().trim();
    const pronunciation = (entry.pronunciation || entry.ipa || '').toString().trim();
    const meaning = (entry.meaning || entry.definition || '').toString().trim();
    const example = (entry.example || entry.context || '').toString().trim();
    const category = (entry.category || 'general').toString().trim();
    if (!word || !meaning) return null;
    return { word, pronunciation, meaning, example, category };
}

// ------------------------------
// Generación dinámica de exámenes por IA
// ------------------------------
async function generateExamScenarios(count = 5, level = 'B1') {
    count = Math.max(1, Math.min(30, Number(count) || 5));
    const prompt = `Genera ${count} escenarios de examen de vocabulario de videojuegos apropiados para nivel ${level}.` +
    ` Devuelve UNICAMENTE un array JSON. Cada escenario debe tener: type (translation|listening|dialogue), title, hint, and depending on type: text (for translation), words (array, for listening), dialogue (array of {speaker,text}) and expectedWords (array) for dialogue.`;

    try {
        const sys = TEACHER_SYSTEM_PROMPT + `\nGenerar exámenes: nivel ${level}`;
        let raw = await callGeminiAPI(prompt, sys);
        if (typeof raw === 'string' && raw.startsWith('Error:')) {
            console.error('generateExamScenarios: callGeminiAPI error:', raw);
            return { success: false, error: raw };
        }

        let jsonText = extractJSON(raw);
        let attempts = 0;
        while (!jsonText && attempts < 2) {
            attempts++;
            console.warn(`generateExamScenarios: JSON not found on attempt ${attempts}, reprompting model for clean JSON`);
            const schemaHint = '{type,title,hint, text?|words?|dialogue?, expectedWords?} (array)';
            const repaired = await repromptForJSON(raw, schemaHint);
            if (repaired) {
                jsonText = repaired;
                break;
            }
            console.error('generateExamScenarios: reprompt did not return valid JSON. Raw (truncated):', (raw && raw.toString().substring(0,1000)) || raw);
            raw = await callGeminiAPI(prompt + '\nPor favor responde SOLO con el JSON solicitado.', sys);
            if (typeof raw === 'string' && raw.startsWith('Error:')) break;
            jsonText = extractJSON(raw);
        }

        if (!jsonText) {
            console.error('generateExamScenarios: raw response (truncated):', (raw && raw.toString().substring(0,1000)) || raw);
            throw new Error('No JSON encontrado en la respuesta de la IA');
        }
        const parsed = JSON.parse(jsonText);

        // Normalize to array: accept { items: [...] } or wrap single scenario
        let parsedArray = null;
        if (Array.isArray(parsed)) {
            parsedArray = parsed;
        } else if (parsed && typeof parsed === 'object') {
            const candidateKeys = ['items', 'scenarios', 'exams', 'data', 'list', 'results'];
            for (const k of candidateKeys) {
                if (Array.isArray(parsed[k])) { parsedArray = parsed[k]; break; }
            }
            if (!parsedArray) {
                for (const k in parsed) {
                    if (Array.isArray(parsed[k])) { parsedArray = parsed[k]; break; }
                }
            }
            if (!parsedArray) {
                // wrap single scenario if keys look like a scenario
                if (parsed.type && parsed.title) parsedArray = [parsed];
            }
        }

        if (!parsedArray) {
            console.error('generateExamScenarios: parsed JSON is not an array and no candidate array found. Parsed:', parsed);
            throw new Error('El JSON de exámenes no contiene un array esperado');
        }

        // Basic validation: ensure type and title
        const valid = parsedArray.map(s => {
            if (!s || !s.type || !s.title) return null;
            return s;
        }).filter(Boolean);

        // Persist generated exams
        try {
            const existingRaw = localStorage.getItem('generatedExams');
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            const merged = existing.concat(valid);
            localStorage.setItem('generatedExams', JSON.stringify(merged));
        } catch (e) {
            console.error('Error saving generatedExams', e);
        }

        // Merge into runtime examScenarios
        try {
            valid.forEach(s => examScenarios.push(s));
        } catch (e) {
            console.error('Error merging generated exams', e);
        }

        return { success: true, added: valid.length, items: valid };
    } catch (e) {
        console.error('generateExamScenarios error', e);
        return { success: false, error: e.message };
    }
}
