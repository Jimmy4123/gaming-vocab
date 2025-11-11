# 🔧 GUÍA DE SOLUCIÓN DE PROBLEMAS - API GEMINI

## ❌ Problema: "Error de API" o "Unexpected response"

Este documento te ayuda a diagnosticar y resolver los problemas con la API de Gemini.

---

## 🧪 PASO 1: Verificar la Configuración

### ¿La API Key es correcta?

1. Abre `config.js`
2. Verifica que la línea:
```javascript
const GEMINI_API_KEY = 'AIzaSyBJGAFO9nl7STzcG_0cGs8Jyvl6yN0aZWQ';
```
**Sea exactamente así** (sin espacios extra)

### ¿La URL del modelo es correcta?

Debe ser una de estas:
```javascript
// Opción 1 (Recomendada - Más estable):
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent';

// Opción 2 (Alternativa):
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

// Opción 3 (Si el 2.0 no funciona):
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
```

---

## 🧪 PASO 2: Prueba de Conectividad

### Usar la página de prueba

1. Abre `api-test.html` en tu navegador
2. Haz clic en **"Enviar Prueba Simple"**
3. **Revisa la consola del navegador** (F12 → Console)

### Qué buscar en la consola:

✅ **Si ves esto, es éxito:**
```
📤 Enviando solicitud a Gemini API...
📨 Respuesta recibida con status: 200
✅ Respuesta exitosa
```

❌ **Si ves esto, hay problema:**
```
❌ Error HTTP 401
(Error de autenticación - verifica la API Key)
```

---

## 🔍 ERRORES COMUNES Y SOLUCIONES

### Error 1: "Error 401 - Unauthorized"

**Causa:** API Key inválida o expirada

**Solución:**
1. Obtén una nueva API Key de: https://ai.google.dev/
2. Reemplaza en `config.js`:
```javascript
const GEMINI_API_KEY = 'TU_NUEVA_KEY_AQUI';
```

### Error 2: "Error 429 - Too Many Requests"

**Causa:** Has hecho demasiadas solicitudes en poco tiempo

**Solución:**
1. Espera 2-3 minutos
2. Recarga la página
3. Intenta de nuevo

### Error 3: "Error 500 - Internal Server Error"

**Causa:** Problema en los servidores de Google

**Solución:**
1. Usa un modelo diferente (prueba `gemini-2.0-flash-001`)
2. Espera 5 minutos
3. Intenta de nuevo

### Error 4: "Formato de respuesta inesperado"

**Causa:** La estructura JSON es diferente a la esperada

**Solución:**
1. Abre `api-test.html`
2. Haz clic en **"Ejecutar Diagnóstico Completo"**
3. Revisa qué estructura recibe
4. Actualiza `config.js` con la estructura correcta

---

## 🛠️ MÉTODO 1: Probar Directamente en Consola

1. Abre tu navegador
2. Presiona **F12** para abrir Developer Tools
3. Ve a la pestaña **Console**
4. Escribe:

```javascript
// Prueba 1: Verifica que la API Key existe
console.log(GEMINI_API_KEY);

// Prueba 2: Llama a la API
callGeminiAPI('Hola, ¿cómo estás?').then(response => console.log(response));

// Prueba 3: Con system prompt
callGeminiAPI('Explica qué es un buff', 'Eres un profesor de inglés').then(response => console.log(response));
```

### Resultado esperado:
```
📤 Enviando solicitud a Gemini API...
📨 Respuesta recibida con status: 200
✅ Respuesta exitosa
[Aquí verás la respuesta]
```

---

## 🛠️ MÉTODO 2: Revisar la Consola del Navegador

### Pasos:
1. Abre `index.html`
2. Presiona **F12** para Developer Tools
3. Ve a la pestaña **Console**
4. Intenta usar el Profesor IA
5. Revisa los logs detallados

### Logs importantes:

```
📤 Enviando solicitud a Gemini API...
🔑 URL: https://...
📋 Body enviado: {...}
📨 Respuesta recibida con status: 200
📄 Content-Type: application/json
✅ JSON parseado correctamente
✅ Respuesta exitosa - Primeras 100 caracteres: ...
```

---

## 🔄 ACTUALIZAR MODELOS DISPONIBLES

Google actualiza regularmente los modelos. Si los actuales no funcionan, prueba estos:

### Modelos más recientes (2025):

```javascript
// Opción 1: Flash 2.0 (Recomendado)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent';

// Opción 2: Pro
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

// Opción 3: Flash 1.5
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Opción 4: Pro 1.5
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
```

Prueba cada una en `api-test.html` hasta encontrar la que funciona.

---

## 🔐 OBTENER NUEVA API KEY

Si todo lo anterior falla, obtén una nueva API Key:

1. Abre: https://ai.google.dev/
2. Haz clic en **"Get API Key"**
3. Sigue los pasos
4. Copia tu nueva key
5. Reemplaza en `config.js`

**IMPORTANTE:** 
- No compartas tu API Key
- Mantén control de cuántas requests haces (hay límites)
- La key debe estar en un archivo seguro en producción

---

## 📊 VERIFICAR CUOTA DE USO

1. Ve a: https://console.cloud.google.com/
2. Selecciona tu proyecto
3. Ve a **APIs & Services** → **Quotas**
4. Busca "Generative Language API"
5. Verifica tu uso y límites

---

## 💡 SOLUCIONES RÁPIDAS

### "La app funciona pero sin IA"
→ Verifica el archivo `config.js` (línea 1-2)
→ Recarga la página (Ctrl+F5)

### "El Profesor IA no responde"
→ Abre `api-test.html` y prueba
→ Revisa los logs en F12 → Console

### "Errores intermitentes"
→ Espera unos minutos (límite de rate)
→ Recarga la página
→ Intenta con menos caracteres en el prompt

### "Todo parece estar bien pero falla"
→ Abre tu navegador en modo incógnito
→ Limpia cache: Ctrl+Shift+Del
→ Cierra todas las ventanas y abre de nuevo

---

## 📝 CHECKLIST DE DIAGNÓSTICO

- [ ] La API Key está correcta en `config.js`
- [ ] La URL del modelo está en `config.js`
- [ ] Tienes conexión a internet
- [ ] Abriste `api-test.html` y viste la prueba
- [ ] La consola (F12) muestra logs detallados
- [ ] Esperaste 2-3 minutos si había error 429
- [ ] Probaste con un modelo diferente
- [ ] Limpiaste cache del navegador
- [ ] El API Key no tiene límites alcanzados
- [ ] La página se recarga después de cambios en `config.js`

---

## 🆘 SI NADA FUNCIONA

Intenta esto en orden:

```javascript
// 1. En la consola, verifica la key
console.log('API Key valida:', GEMINI_API_KEY.length > 30);

// 2. Prueba fetch directo
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        contents: [{parts: [{text: 'Hola'}]}],
        generationConfig: {maxOutputTokens: 50}
    })
}).then(r => r.json()).then(d => console.log(d));

// 3. Si esto imprime un error, copia el error completo
```

---

## 📞 RECURSOS

- **API Gemini:** https://ai.google.dev/
- **Documentación:** https://ai.google.dev/tutorials
- **Console API:** https://console.cloud.google.com/
- **Estado del servicio:** https://status.cloud.google.com/

---

**Última actualización:** 10 de Noviembre, 2025
**Versión:** 2.0 - Troubleshooting Gemini 2.5 Flash
