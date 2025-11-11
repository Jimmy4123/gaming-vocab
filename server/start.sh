#!/bin/bash

# Gaming Vocab - Proxy Server Starter para Linux/Mac
# Este script inicia el servidor proxy para la aplicación Gaming Vocab

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$PROJECT_DIR/server"
PORT=${1:-3000}

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║   Gaming Vocab - Proxy Server             ║"
echo "║   Iniciando servidor en puerto $PORT...       ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "Por favor, instala Node.js desde https://nodejs.org"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# Cambiar a directorio del servidor
cd "$SERVER_DIR" || {
    echo "❌ Error: No se puede acceder a $SERVER_DIR"
    exit 1
}

# Iniciar el servidor
echo "🚀 Iniciando servidor proxy..."
echo ""

PORT=$PORT node proxy.js
