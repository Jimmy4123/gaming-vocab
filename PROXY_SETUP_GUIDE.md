# 🎮 Gaming Vocab - Guía de Configuración y Uso

## Problema Resuelto ✅

El error de proxy ha sido completamente solucionado. El proyecto ahora usa un servidor proxy Node.js seguro para comunicarse con Gemini API en lugar de exponer la clave API directamente en el cliente.

---

## Requisitos

- **Node.js 14+** (descargable desde https://nodejs.org/)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Terminal/CMD** para ejecutar comandos

---

## Instalación Rápida (⚡ 2 minutos)

### 1️⃣ Verificar Node.js

```bash
node --version
npm --version
```

Si no tienes Node.js instalado, descárgalo desde https://nodejs.org/

### 2️⃣ Iniciar el Servidor Proxy

**En Linux/Mac:**
```bash
cd english-gaming-vocab/server
chmod +x start.sh
./start.sh
```

**En Windows:**
```cmd
cd english-gaming-vocab\server
node proxy.js
```

**O directamente en cualquier sistema:**
```bash
cd english-gaming-vocab/server
node proxy.js
```

Deberías ver:
```
✅ Gaming Vocab Proxy Server iniciado
📍 Dirección: http://localhost:3000
🔗 Endpoint API: http://localhost:3000/api/generate
💚 Health check: http://localhost:3000/health
⚡ Listo para procesar solicitudes...
```

### 3️⃣ Abrir la Aplicación

Una vez que el servidor está corriendo, abre en tu navegador:

```
http://localhost/english-gaming-vocab/index.html
```

O si usas un servidor local:
```
http://localhost:8000/english-gaming-vocab/index.html
```

---

## Estructura de Archivos Configurados

```
english-gaming-vocab/
├── server/
│   ├── proxy.js          ← Servidor proxy Node.js (NUEVO)
│   ├── start.sh          ← Script para iniciar en Linux/Mac (ACTUALIZADO)
│   └── start.bat         ← Script para iniciar en Windows
├── config.js             ← Configuración actualizada para usar proxy
├── config-proxy.js       ← Configuración del proxy (NUEVO)
├── index.html            ← HTML principal (actualizado con config-proxy.js)
└── ... otros archivos
```

---

## Características del Proxy Server

✅ **Seguridad**: La clave API nunca se expone al cliente  
✅ **Reintentos Automáticos**: Maneja errores de red y límites de tasa  
✅ **CORS**: Permite solicitudes desde cualquier origen  
✅ **Health Check**: Endpoint `/health` para verificar el estado  
✅ **Logging**: Registro detallado de todas las solicitudes  
✅ **Manejo de Errores**: Respuestas claras en caso de problemas

---

## Solución de Problemas

### ❌ Error: "Can't connect to proxy"

**Solución:**
1. Verifica que el servidor está corriendo (`node proxy.js` en `server/`)
2. Verifica que el puerto 3000 no está en uso:
   ```bash
   lsof -i :3000  # En Linux/Mac
   netstat -ano | findstr :3000  # En Windows
   ```
3. Prueba con otro puerto:
   ```bash
   PORT=3001 node proxy.js
   ```
   Luego actualiza la URL en la consola del navegador:
   ```javascript
   localStorage.setItem('proxyUrl', 'http://localhost:3001');
   location.reload();
   ```

### ❌ Error: "Node.js not found"

**Solución:**
Instala Node.js desde https://nodejs.org/ (recomendado: versión LTS)

### ❌ Puerto 3000 ya está en uso

**Solución:**
```bash
PORT=3001 node proxy.js
PORT=3002 node proxy.js
```

---

## Verificar que Todo Funciona

### 1. Health Check en Terminal

```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{"status":"healthy","timestamp":"2025-11-10T..."}
```

### 2. Desde la Consola del Navegador

Abre DevTools (F12) y ejecuta:

```javascript
// Verificar conexión al proxy
window.proxyConfig.verifyProxyConnection();

// Resultado esperado:
// ✅ Conectado al proxy: http://localhost:3000
```

### 3. Prueba Completa

En la consola del navegador:
```javascript
// Ver configuración del proxy
console.log(window.proxyConfig);

// Ver logs detallados
localStorage.setItem('debugProxy', 'true');
location.reload();
```

---

## Flujo de Funcionamiento

```
┌─────────────────────────────────────────────────────────┐
│          Navegador (index.html)                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ callGeminiAPI() ← Solicitud de usuario            │ │
│  └──────────────┬─────────────────────────────────────┘ │
└─────────────────┼─────────────────────────────────────────┘
                  │ JSON POST
                  │ /api/generate
                  ▼
    ┌─────────────────────────────────┐
    │  localhost:3000 (Proxy)         │
    │  ┌───────────────────────────┐  │
    │  │ proxy.js                  │  │
    │  │ - CORS headers            │  │
    │  │ - Manejo de errores       │  │
    │  │ - Reintentos              │  │
    │  │ - Logging                 │  │
    │  └──────────────┬────────────┘  │
    └─────────────────┼────────────────┘
                      │ HTTPS
                      │ Solicitud Gemini API
                      │ (con clave API)
                      ▼
    ┌─────────────────────────────────┐
    │  Gemini API (Google)            │
    │  generativelanguage.googleapis   │
    └─────────────────┬───────────────┘
                      │ JSON Response
                      ▼
    ┌─────────────────────────────────┐
    │  localhost:3000 (Proxy)         │
    │  - Parsear respuesta            │
    │  - Extraer texto                │
    └──────────────┬────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │  Navegador                      │
    │  - Mostrar respuesta al usuario │
    └─────────────────────────────────┘
```

---

## Scripts Disponibles

### En Linux/Mac:

```bash
# Iniciar servidor (puerto 3000)
cd server && ./start.sh

# O con puerto personalizado
PORT=3001 node proxy.js

# Verificar estado
curl http://localhost:3000/health
```

### En Windows:

```cmd
REM Iniciar servidor
cd server
node proxy.js

REM O con puerto personalizado
set PORT=3001
node proxy.js
```

---

## Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `server/proxy.js` | Servidor proxy Node.js (maneja solicitudes API) |
| `config.js` | Configuración de Gemini (usa proxy) |
| `config-proxy.js` | Configuración del cliente proxy |
| `index.html` | HTML principal (carga config-proxy.js primero) |

---

## Próximos Pasos

1. ✅ Verifica que Node.js está instalado
2. ✅ Inicia el servidor proxy: `node proxy.js` (en `/server`)
3. ✅ Abre la aplicación en el navegador
4. ✅ Prueba las funciones (vocabulario, IA, historias, etc.)
5. 📝 Reporta cualquier problema

---

## Soporte

Si encuentras problemas:

1. **Verifica los logs del servidor** - Debería mostrar todas las solicitudes
2. **Abre DevTools en el navegador** (F12) - Revisa la consola
3. **Verifica el puerto** - Asegúrate que no hay conflictos
4. **Reinicia el servidor** - A veces basta con reiniciar

---

## Información Técnica

- **Servidor**: Node.js HTTP server
- **Puerto por defecto**: 3000
- **Timeout**: 30 segundos por solicitud
- **Reintentos**: Hasta 3 intentos con backoff exponencial
- **CORS**: Habilitado para todas las direcciones

---

**¡Tu aplicación Gaming Vocab está lista para usar!** 🎮✨

Última actualización: 10 de noviembre de 2025
