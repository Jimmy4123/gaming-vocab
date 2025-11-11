#!/bin/bash

# Script simple para exponer Gaming Vocab al mundo
# Opción 1: ngrok (requiere cuenta)
# Opción 2: Replit (gratuito, sin configuración)

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║    Gaming Vocab - Hacer Público al Mundo                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$PROJECT_DIR/server"

# Opción más simple: usar un servidor Express con CORS habilitado
echo "✅ Creando servidor público con Express..."
echo ""

# Crear package.json si no existe
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    cat > "$PROJECT_DIR/package.json" << 'EOF'
{
  "name": "gaming-vocab",
  "version": "1.0.0",
  "description": "Gaming Vocabulary Learning App",
  "main": "public-server.js",
  "scripts": {
    "start": "node public-server.js",
    "dev": "PORT=3002 node server/proxy.js & python3 -m http.server 8000"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
EOF
    echo "📦 Instalando dependencias..."
    cd "$PROJECT_DIR"
    npm install 2>&1 | grep -E "added|up to date"
fi

# Crear servidor Express público
cat > "$PROJECT_DIR/public-server.js" << 'EOF'
const express = require('express');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para que funcione desde cualquier lugar
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Proxy para las solicitudes de IA
app.post('/api/generate', async (req, res) => {
    try {
        // Aquí se implementaría la lógica de proxy a Gemini
        // Por ahora, redireccionar a localhost:3002 si está disponible
        const proxyResponse = await fetch('http://localhost:3002/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        const data = await proxyResponse.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy error' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ Gaming Vocab Servidor Público`);
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🌐 Acceso remoto: http://localhost:${PORT}/index.html`);
    console.log(`\n⚡ Listo para recibir conexiones del mundo entero\n`);
});
EOF

echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "✅ Servidor público creado"
echo ""
echo "Para hacer el sitio accesible globalmente tienes 2 opciones:"
echo ""
echo "1️⃣  OPCIÓN FÁCIL: Desplegar en Replit (GRATUITO)"
echo "   • Ve a: https://replit.com"
echo "   • Haz fork del proyecto"
echo "   • Se abre automáticamente en URL pública (*.replit.dev)"
echo ""
echo "2️⃣  OPCIÓN NGROK: Exponer servidor local"
echo "   • Instala ngrok: npm install -g ngrok"
echo "   • Crea cuenta en: https://ngrok.com"
echo "   • Ejecuta: ngrok http 3000"
echo ""
echo "3️⃣  OPCIÓN LOCALHOST: Solo local"
echo "   • Ejecuta este servidor: node public-server.js"
echo "   • Accede en: http://localhost:3000"
echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""
