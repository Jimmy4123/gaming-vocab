#!/bin/bash

# Gaming Vocab - Startup Script
# Este script inicia automáticamente el servidor con la API key cargada

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║      🎮 GAMING VOCAB - INICIANDO SERVIDOR                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "   Descárgalo desde: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo ""

# Cambiar al directorio
cd "$PROJECT_DIR"

# Verificar .env.local
if [ ! -f ".env.local" ]; then
    echo "❌ Error: Falta el archivo .env.local"
    exit 1
fi

echo "✅ Archivo .env.local encontrado"
echo ""

# Mostrar instrucciones
echo "🚀 Iniciando servidor..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Abre tu navegador en esta dirección:"
echo ""
echo "   🔗 http://localhost:3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Espera a que se cargue la aplicación..."
echo ""
echo "⏹️  Para detener el servidor, presiona: Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Iniciar el servidor
node public-server.js
