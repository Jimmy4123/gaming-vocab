/**
 * CONFIGURACIÓN DE PROXY
 * Este archivo configura la aplicación para usar el servidor proxy
 * en lugar de llamar directamente a Gemini API
 */

// Detectar si estamos en un entorno de desarrollo local con proxy
// NOTA: Se detecta automáticamente el puerto basado en la ubicación
function getProxyURL() {
    // Si estamos en localhost, usar puerto 3002
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3002';
    }
    // Si tenemos NGROK_URL en variables globales (cuando se despliega)
    if (typeof window.NGROK_URL !== 'undefined' && window.NGROK_URL) {
        return window.NGROK_URL;
    }
    // Para producción, usar la misma URL que el frontend
    return window.location.origin.replace('8000', '3002');
}

const PROXY_URL = getProxyURL();
const USE_PROXY = true;
const DEBUG_PROXY = false;

/**
 * Llamar a Gemini API a través del proxy
 */
async function callGeminiAPIViaProxy(prompt, systemPrompt = '') {
    const maxRetries = 3;
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    const requestBody = {
        prompt: prompt,
        systemPrompt: systemPrompt,
        model: 'gemini-2.0-flash-001',
        temperature: 0.7,
        maxOutputTokens: 1024
    };

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt === 0 && DEBUG_PROXY) console.log('📤 Enviando solicitud a través del proxy...');
            if (attempt > 0 && DEBUG_PROXY) console.log(`🔄 Reintentando (intento ${attempt}/${maxRetries})...`);

            const response = await fetch(`${PROXY_URL}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                timeout: 30000
            });

            if (!response.ok) {
                if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 800 + Math.random() * 300;
                    if (DEBUG_PROXY) console.log(`⏳ Esperando ${Math.round(delay)}ms antes de reintentar...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (DEBUG_PROXY) console.log('✅ Respuesta recibida del proxy');
            
            if (data.response) {
                return data.response;
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                throw new Error('Respuesta inválida del proxy');
            }

        } catch (error) {
            if (attempt < maxRetries) {
                console.warn(`⚠️ Intento ${attempt + 1} falló:`, error.message);
                const delay = Math.pow(2, attempt) * 800;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('❌ Error después de ', maxRetries, ' reintentos:', error.message);
                throw error;
            }
        }
    }
}

/**
 * Función para verificar la conexión con el proxy
 */
async function verifyProxyConnection() {
    try {
        const response = await fetch(`${PROXY_URL}/health`, {
            method: 'GET',
            timeout: 5000
        });
        
        if (response.ok) {
            console.log(`✅ Conectado al proxy: ${PROXY_URL}`);
            return true;
        } else {
            console.warn(`⚠️ Proxy respondió con código: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ No se puede conectar al proxy: ${PROXY_URL}`, error.message);
        return false;
    }
}

/**
 * Configurar URL del proxy personalizada
 */
function setProxyUrl(newUrl) {
    localStorage.setItem('proxyUrl', newUrl);
    location.reload();
}

/**
 * Habilitar/deshabilitar proxy
 */
function setUseProxy(enabled) {
    localStorage.setItem('useProxy', enabled ? 'true' : 'false');
    location.reload();
}

/**
 * Exportar o mostrar la función en la consola
 */
if (typeof window !== 'undefined') {
    window.proxyConfig = {
        PROXY_URL,
        USE_PROXY,
        verifyProxyConnection,
        setProxyUrl,
        setUseProxy
    };
    console.log('🔧 Configuración de Proxy disponible en: window.proxyConfig');
}
