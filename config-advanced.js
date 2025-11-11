// ===== CONFIGURACIÓN ALTERNATIVA DE GEMINI API =====
// Este archivo contiene múltiples modelos para probar si uno falla

// OPCIÓN 1: Gemini 2.0 Flash (Recomendado - Más estable)
const GEMINI_CONFIG_1 = {
    // key must be provided via environment variable (process.env.GEMINI_API_KEY)
    key: process.env.GEMINI_API_KEY,
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent',
    name: 'Gemini 2.0 Flash'
};

// OPCIÓN 2: Gemini 1.5 Flash (Alternativa estable)
const GEMINI_CONFIG_2 = {
    key: process.env.GEMINI_API_KEY,
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    name: 'Gemini 1.5 Flash'
};

// OPCIÓN 3: Gemini 1.5 Pro (Si Flash no funciona)
const GEMINI_CONFIG_3 = {
    key: process.env.GEMINI_API_KEY,
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
    name: 'Gemini 1.5 Pro'
};

// OPCIÓN 4: Gemini Pro (Versión v1 más compatible)
const GEMINI_CONFIG_4 = {
    key: process.env.GEMINI_API_KEY,
    url: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
    name: 'Gemini Pro (v1)'
};

// ===== SELECCIONAR CONFIGURACIÓN ACTIVA =====
let CURRENT_CONFIG_INDEX = 0;
const CONFIGS = [GEMINI_CONFIG_1, GEMINI_CONFIG_2, GEMINI_CONFIG_3, GEMINI_CONFIG_4];

function getActiveConfig() {
    return CONFIGS[CURRENT_CONFIG_INDEX];
}

function switchToNextConfig() {
    CURRENT_CONFIG_INDEX = (CURRENT_CONFIG_INDEX + 1) % CONFIGS.length;
    const config = getActiveConfig();
    console.log(`🔄 Cambiando a: ${config.name}`);
    return config;
}

function getCurrentConfigName() {
    return getActiveConfig().name;
}

// Variables globales usando la configuración activa
const GEMINI_API_KEY = getActiveConfig().key;
const GEMINI_API_URL = getActiveConfig().url;

// ===== FUNCIÓN MEJORADA CON AUTO-FALLBACK =====
async function callGeminiAPI(prompt, systemPrompt = '', retryCount = 0) {
    const MAX_RETRIES = 3;
    
    try {
        const config = getActiveConfig();
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        
        console.log(`📤 [${config.name}] Enviando solicitud...`);
        
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: fullPrompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };
        
        const response = await fetch(config.url + '?key=' + config.key, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log(`📨 Status: ${response.status}`);
        
        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error('❌ Error parseando JSON:', e.message);
            throw new Error('No se pudo parsear la respuesta JSON');
        }
        
        // Manejo de errores HTTP
        if (!response.ok) {
            if (data.error) {
                const errorMsg = data.error.message || data.error;
                console.error(`❌ [${response.status}] ${errorMsg}`);
                
                // Auto-fallback si el modelo no existe
                if ((response.status === 400 || response.status === 404) && retryCount < MAX_RETRIES) {
                    console.log(`⚠️ Modelo actual no disponible, probando siguiente...`);
                    switchToNextConfig();
                    return await callGeminiAPI(prompt, systemPrompt, retryCount + 1);
                }
                
                throw new Error(`${response.status}: ${errorMsg}`);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        }
        
        // Extraer respuesta
        let responseText = null;
        
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                responseText = candidate.content.parts[0].text;
            }
        }
        
        if (!responseText) {
            console.error('❌ No hay texto en la respuesta:', data);
            throw new Error('La respuesta no contiene texto');
        }
        
        console.log(`✅ Respuesta exitosa (${config.name})`);
        return responseText;
        
    } catch (error) {
        console.error(`❌ Error en callGeminiAPI:`, error.message);
        
        // Si aún hay configs por probar, intenta la siguiente
        if (retryCount < MAX_RETRIES) {
            console.log(`⚠️ Reintentando con siguiente configuración...`);
            switchToNextConfig();
            return await callGeminiAPI(prompt, systemPrompt, retryCount + 1);
        }
        
        return `Error: No se pudo conectar con ninguna configuración de Gemini API. ${error.message}`;
    }
}

// ===== FUNCIÓN DE DIAGNÓSTICO =====
async function diagnoseGeminiAPI() {
    console.log('🔍 Iniciando diagnóstico de Gemini API...');
    
    for (let i = 0; i < CONFIGS.length; i++) {
        const config = CONFIGS[i];
        console.log(`\n🧪 Probando: ${config.name}`);
        console.log(`   URL: ${config.url}`);
        
        try {
            const response = await fetch(config.url + '?key=' + config.key, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    contents: [{parts: [{text: 'test'}]}],
                    generationConfig: {maxOutputTokens: 10}
                })
            });
            
            console.log(`   Status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.candidates) {
                    console.log(`   ✅ FUNCIONA - ${config.name}`);
                    return i;
                }
            } else {
                const data = await response.json();
                console.log(`   ❌ Error: ${data.error?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.log(`   ❌ Fallo de conectividad: ${error.message}`);
        }
    }
    
    console.log('\n⚠️ Ninguna configuración funcionó. Verifica tu API Key.');
    return -1;
}

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIGS, getActiveConfig, switchToNextConfig, callGeminiAPI, diagnoseGeminiAPI };
}
