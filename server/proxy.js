/**
 * GEMINI API PROXY SERVER
 * Intermediario seguro para llamadas a Gemini API
 * Evita exponer la clave API en el cliente
 */

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno desde .env.local en desarrollo local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
    console.log('✅ Variables de entorno cargadas desde .env.local');
}

// Configuración
// La API key debe venir de una variable de entorno (no almacenada en el repositorio)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.warn('⚠️ WARNING: GEMINI_API_KEY no está definida en el entorno. Configure GEMINI_API_KEY en tu servidor o en Vercel.');
}
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com';
const PORT = process.env.PORT || 3000;
const ALLOWED_MODELS = ['gemini-2.0-flash-001', 'gemini-2.5-flash-001'];

// Crear servidor HTTP
const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Manejo de preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Log de solicitud
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    try {
        if (req.url === '/api/generate' && req.method === 'POST') {
            handleGenerateContent(req, res);
        } else if (req.url === '/health' && req.method === 'GET') {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
        } else if (req.url === '/' && req.method === 'GET') {
            res.writeHead(200);
            res.end(JSON.stringify({ 
                message: 'Gaming Vocab Proxy Server',
                status: 'running',
                endpoints: ['/api/generate', '/health']
            }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
    }
});

/**
 * Maneja solicitudes de generación de contenido
 */
function handleGenerateContent(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', async () => {
        try {
            const requestData = JSON.parse(body);
            
            // Validar entrada
            if (!requestData.prompt) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing required field: prompt' }));
                return;
            }

            const model = requestData.model || 'gemini-2.0-flash-001';
            const systemPrompt = requestData.systemPrompt || '';
            const temperature = requestData.temperature || 0.7;
            const maxOutputTokens = requestData.maxOutputTokens || 1024;

            // Validar modelo
            if (!ALLOWED_MODELS.includes(model)) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: `Invalid model. Allowed: ${ALLOWED_MODELS.join(', ')}` }));
                return;
            }

            // Construir prompt completo
            const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${requestData.prompt}` : requestData.prompt;

            // Construir cuerpo de solicitud a Gemini
            const geminiRequest = {
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
                    temperature,
                    maxOutputTokens,
                    topK: 40,
                    topP: 0.95
                }
            };

            // Realizar solicitud a Gemini API
            const geminiUrl = `${GEMINI_API_BASE}/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
            
            console.log(`[GEMINI] Enviando solicitud al modelo: ${model}`);
            
            const response = await callGeminiAPI(geminiUrl, geminiRequest);
            
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                response: response,
                model: model,
                timestamp: new Date().toISOString()
            }));

        } catch (error) {
            console.error('Error processing request:', error);
            res.writeHead(500);
            res.end(JSON.stringify({ 
                error: 'Failed to process request',
                details: error.message 
            }));
        }
    });
}

/**
 * Realiza llamada HTTPS a Gemini API con reintentos
 */
function callGeminiAPI(geminiUrl, requestBody) {
    return new Promise((resolve, reject) => {
        const maxRetries = 3;
        const retryDelay = 1000;

        const attemptRequest = (attempt) => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
                },
                timeout: 30000
            };

            const req = https.request(geminiUrl, options, (res) => {
                let data = '';

                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const parsed = JSON.parse(data);
                            // Extraer texto de la respuesta
                            if (parsed.candidates && parsed.candidates[0] && 
                                parsed.candidates[0].content && 
                                parsed.candidates[0].content.parts && 
                                parsed.candidates[0].content.parts[0]) {
                                resolve(parsed.candidates[0].content.parts[0].text);
                            } else {
                                reject(new Error('Invalid response format from Gemini'));
                            }
                        } catch (e) {
                            reject(new Error(`Failed to parse response: ${e.message}`));
                        }
                    } else if ((res.statusCode === 429 || res.statusCode >= 500) && attempt < maxRetries) {
                        const delay = Math.pow(2, attempt) * retryDelay;
                        console.log(`[GEMINI] Status ${res.statusCode}, reintentando en ${delay}ms (intento ${attempt + 1}/${maxRetries})`);
                        setTimeout(() => attemptRequest(attempt + 1), delay);
                    } else {
                        reject(new Error(`Gemini API error: ${res.statusCode} - ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                if (attempt < maxRetries) {
                    console.log(`[GEMINI] Error en solicitud, reintentando en ${retryDelay}ms...`);
                    setTimeout(() => attemptRequest(attempt + 1), retryDelay);
                } else {
                    reject(error);
                }
            });

            req.on('timeout', () => {
                req.abort();
                if (attempt < maxRetries) {
                    console.log(`[GEMINI] Timeout, reintentando...`);
                    setTimeout(() => attemptRequest(attempt + 1), retryDelay);
                } else {
                    reject(new Error('Request timeout'));
                }
            });

            req.write(JSON.stringify(requestBody));
            req.end();
        };

        attemptRequest(0);
    });
}

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`\n✅ Gaming Vocab Proxy Server iniciado`);
    console.log(`📍 Dirección: http://localhost:${PORT}`);
    console.log(`🔗 Endpoint API: http://localhost:${PORT}/api/generate`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`\n⚡ Listo para procesar solicitudes...\n`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada sin manejar:', reason);
    process.exit(1);
});
