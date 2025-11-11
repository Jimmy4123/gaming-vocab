#!/bin/bash

# Script para exponer Gaming Vocab al mundo usando ngrok
# Permite que cualquier usuario del mundo acceda a la aplicación

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Gaming Vocab - Exposición Global con ngrok            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$PROJECT_DIR/server"

echo -e "${BLUE}📍 Proyecto en: $PROJECT_DIR${NC}"
echo ""

# Verificar que ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}❌ ngrok no está instalado${NC}"
    echo "Instala con: npm install -g ngrok"
    exit 1
fi

echo -e "${GREEN}✅ ngrok disponible${NC}"
echo ""

# Iniciar servidores en background
echo -e "${YELLOW}🚀 Iniciando servidores...${NC}"
echo ""

# Puerto del proxy
PROXY_PORT=3002
WEB_PORT=8000

# Detener procesos anteriores en estos puertos
lsof -ti:$PROXY_PORT 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti:$WEB_PORT 2>/dev/null | xargs kill -9 2>/dev/null || true

# Iniciar servidor proxy
echo "  • Iniciando Proxy Server (puerto $PROXY_PORT)..."
cd "$SERVER_DIR"
env PORT=$PROXY_PORT node proxy.js > /tmp/proxy-server.log 2>&1 &
PROXY_PID=$!
sleep 2

# Iniciar servidor web
echo "  • Iniciando Web Server (puerto $WEB_PORT)..."
cd "$PROJECT_DIR"
python3 -m http.server $WEB_PORT > /tmp/web-server.log 2>&1 &
WEB_PID=$!
sleep 2

echo -e "${GREEN}✅ Servidores iniciados${NC}"
echo ""
echo "  - Proxy PID: $PROXY_PID"
echo "  - Web PID: $WEB_PID"
echo ""

# Exponer con ngrok
echo -e "${YELLOW}🌐 Exponiendo al mundo con ngrok...${NC}"
echo ""

# Crear túneles ngrok
echo "  • Creando túnel para servidor web (puerto $WEB_PORT)..."
ngrok http $WEB_PORT --log=stdout --log-format=json > /tmp/ngrok-web.log 2>&1 &
NGROK_WEB_PID=$!
sleep 3

# Extraer URL pública del web
WEB_URL=$(grep -o 'https://[a-z0-9-]*\.ngrok-free\.app' /tmp/ngrok-web.log | head -1)

if [ -z "$WEB_URL" ]; then
    echo "Intentando obtener URL de ngrok..."
    sleep 2
    WEB_URL=$(grep -o 'https://[a-z0-9-]*\.ngrok-free\.app' /tmp/ngrok-web.log | head -1)
fi

echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ ¡GAMING VOCAB ESTÁ PÚBLICO EN INTERNET!${NC}"
echo ""
echo "🌐 URL PÚBLICA:"
echo ""
if [ ! -z "$WEB_URL" ]; then
    echo -e "  ${BLUE}${WEB_URL}/index.html${NC}"
    echo ""
    echo "  Copia y compartir este URL con cualquiera del mundo"
else
    echo "  ⚠️  No se pudo obtener URL. Revisa /tmp/ngrok-web.log"
fi
echo ""
echo "🔐 DETALLES:"
echo "  • Proxy Server:   http://localhost:3002"
echo "  • Web Server:     http://localhost:$WEB_PORT"
echo "  • Ngrok Web PID:  $NGROK_WEB_PID"
echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}💡 NOTAS:${NC}"
echo "  • ngrok puede tomar 1-2 minutos para establecer la conexión"
echo "  • Si no ves la URL, reinicia este script"
echo "  • Para detener: Presiona Ctrl+C"
echo ""

# Mantener scripts corriendo
wait
