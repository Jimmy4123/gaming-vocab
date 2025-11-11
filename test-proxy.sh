#!/bin/bash

# Script de prueba automática del proxy
# Verifica que todo está configurado correctamente

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  🎮 Gaming Vocab - Prueba Automática del Proxy"
echo "════════════════════════════════════════════════════════════"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir resultados
print_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${YELLOW}⏳ $1${NC}"
}

# Variables
PROXY_URL="http://localhost:3000"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$PROJECT_DIR/server"

# Test 1: Verificar Node.js
echo "Test 1: Verificar Node.js"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_check 0 "Node.js instalado: $NODE_VERSION"
else
    print_check 1 "Node.js NO está instalado"
    echo ""
    echo "Instálalo desde: https://nodejs.org"
    exit 1
fi
echo ""

# Test 2: Verificar archivos del servidor
echo "Test 2: Verificar archivos del servidor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "$SERVER_DIR/proxy.js" ]; then
    print_check 0 "proxy.js encontrado"
else
    print_check 1 "proxy.js NO encontrado en $SERVER_DIR"
fi

if [ -f "$PROJECT_DIR/config-proxy.js" ]; then
    print_check 0 "config-proxy.js encontrado"
else
    print_check 1 "config-proxy.js NO encontrado"
fi

if [ -f "$PROJECT_DIR/index.html" ]; then
    print_check 0 "index.html encontrado"
else
    print_check 1 "index.html NO encontrado"
fi
echo ""

# Test 3: Intentar conectar al proxy
echo "Test 3: Verificar conexión al proxy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_info "Intentando conectar a $PROXY_URL..."
echo ""

if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$PROXY_URL/health" 2>&1)
    
    if [ "$RESPONSE" = "200" ]; then
        print_check 0 "Proxy respondiendo en $PROXY_URL"
    else
        if [ "$RESPONSE" = "000" ]; then
            print_check 1 "No se puede conectar al proxy (¿está corriendo?)"
            echo ""
            echo "Inicia el servidor proxy con:"
            echo "  cd $SERVER_DIR"
            echo "  node proxy.js"
        else
            print_check 1 "Proxy respondiendo con código: $RESPONSE"
        fi
    fi
else
    print_info "curl no instalado, saltando prueba de conexión"
    echo "Verifica manualmente abriendo en navegador: $PROXY_URL/health"
fi
echo ""

# Test 4: Verificar contenido de archivos
echo "Test 4: Verificar contenido de archivos clave"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "callGeminiAPI" "$PROJECT_DIR/config.js" 2>/dev/null; then
    print_check 0 "config.js contiene callGeminiAPI"
else
    print_check 1 "callGeminiAPI no encontrada en config.js"
fi

if grep -q "PROXY_URL" "$PROJECT_DIR/config.js" 2>/dev/null; then
    print_check 0 "config.js usa PROXY_URL"
else
    print_check 1 "PROXY_URL no encontrada en config.js"
fi

if grep -q "config-proxy.js" "$PROJECT_DIR/index.html" 2>/dev/null; then
    print_check 0 "index.html carga config-proxy.js"
else
    print_check 1 "index.html NO carga config-proxy.js"
fi
echo ""

# Resumen
echo "════════════════════════════════════════════════════════════"
echo "  Prueba Completada"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🔍 Próximos pasos:"
echo ""
echo "1. Si todas las pruebas pasaron:"
echo "   - Abre: check-proxy.html en el navegador"
echo "   - Debería mostrar: ✅ TODO ESTÁ CONFIGURADO CORRECTAMENTE"
echo ""
echo "2. Si hay errores:"
echo "   - Inicia el servidor proxy:"
echo "     cd $SERVER_DIR"
echo "     node proxy.js"
echo ""
echo "3. Luego abre en el navegador:"
echo "   http://localhost/english-gaming-vocab/index.html"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
