// Configuración de Gemini API - USANDO PROXY
// Nota: la API key no debe estar en el cliente. El cliente usa el proxy para comunicarse con Gemini.
const PROXY_URL = typeof localStorage !== 'undefined' ? localStorage.getItem('proxyUrl') || 'http://localhost:3000' : 'http://localhost:3000';
const USE_PROXY = true; // Siempre usar el proxy

// Función para llamar a Gemini API a través del proxy
async function callGeminiAPI(prompt, systemPrompt = '') {
    const maxRetries = 3;

    const requestBody = {
        prompt: prompt,
        systemPrompt: systemPrompt,
        model: 'gemini-2.0-flash-001',
        temperature: 0.7,
        maxOutputTokens: 1024
    };

    // Helper para calcular backoff exponencial con jitter
    function getDelay(attempt) {
        const base = 800; // ms
        const exp = Math.pow(2, attempt) * base;
        const jitter = Math.floor(Math.random() * 300);
        return exp + jitter;
    }

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt === 0) console.log('📤 Enviando solicitud al proxy...');
            else console.log(`📤 Reintentando solicitud al proxy (intento ${attempt}/${maxRetries})...`);

            // Realizar solicitud al proxy
            const response = await fetch(`${PROXY_URL}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📨 Respuesta recibida del proxy con status:', response.status);

            // Intentar parsear JSON
            let data = null;
            try {
                data = await response.json();
                console.log('✅ JSON parseado correctamente');
            } catch (e) {
                const text = await response.text();
                console.error('❌ No se pudo parsear JSON:', text.substring(0, 200));
                throw new Error(`Respuesta inválida: ${text.substring(0, 100)}`);
            }

            // Manejar errores HTTP
            if (!response.ok) {
                console.error('❌ Error HTTP', response.status);
                if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
                    const delay = getDelay(attempt);
                    console.warn(`🔁 Esperando ${delay}ms antes de reintentar...`);
                    await new Promise(r => setTimeout(r, delay));
                    continue;
                }
                if (data && data.error) {
                    console.error('📌 Detalles del error:', data.error);
                    throw new Error(`Proxy error: ${data.error}`);
                } else {
                    throw new Error(`HTTP Error ${response.status}`);
                }
            }

            // Extraer texto de la respuesta
            let responseText = null;
            if (data.response) {
                responseText = data.response;
            } else if (data.error) {
                throw new Error(data.error);
            }

            if (!responseText) {
                console.error('❌ No se encontró texto en la respuesta del proxy');
                console.log('Estructura recibida:', data);
                throw new Error('Respuesta vacía del proxy');
            }

            console.log('✅ Respuesta exitosa - Primeras 100 caracteres:', responseText.substring(0, 100));
            return responseText;
        } catch (error) {
            console.error('❌ Error en callGeminiAPI:', error.message);
            if (attempt < maxRetries) {
                const delay = getDelay(attempt);
                console.warn(`🔁 Esperando ${delay}ms antes de reintentar...`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            console.error('📍 Error final:', error.message);
            return `Error: ${error.message}`;
        }
    }
    return `Error: Max retries exceeded`;
}
