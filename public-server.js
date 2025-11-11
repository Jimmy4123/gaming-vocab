const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para que funcione desde cualquier ubicación
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Proxy para solicitudes de API
app.post('/api/generate', async (req, res) => {
    try {
        // Intentar conectar al proxy local primero
        const proxyUrl = 'http://localhost:3002/api/generate';
        
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            throw new Error(`Proxy error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('❌ Proxy error:', error.message);
        res.status(500).json({ 
            error: 'No se pudo conectar al servidor de IA',
            details: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Servir index.html para todas las rutas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         🎮 Gaming Vocab - Servidor Público                ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Servidor iniciado`);
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL Local: http://localhost:${PORT}`);
    console.log(`🌐 URL de Red: http://${getLocalIP()}:${PORT}`);
    console.log('');
    console.log('✨ Características:');
    console.log('  ✅ CORS habilitado para acceso desde cualquier lugar');
    console.log('  ✅ Proxy integrado para API');
    console.log('  ✅ Archivos estáticos servidos');
    console.log('  ✅ Health check en /health');
    console.log('');
    console.log('🌍 Para hacerlo público globalmente:');
    console.log('   • Usa ngrok: ngrok http ' + PORT);
    console.log('   • O despliega en Replit: https://replit.com');
    console.log('');
});

// Función para obtener IP local
function getLocalIP() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

// Manejo de errores
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    process.exit(1);
});
