# 🔑 Configuración Local de API - Guía Rápida

## ✅ Estado Actual

Tu clave API ya ha sido **configurada localmente** en el archivo `.env.local`.

```
GEMINI_API_KEY=AIzaSyBd8eqsjyNFMadMrvxn4lLxQ0biZ5L2r3g
```

## 🚀 Cómo Usar

### Opción 1: Usar el Servidor Público (Recomendado)

```bash
cd ~/Documentos/wed/english-gaming-vocab
node public-server.js
```

Luego abre en el navegador:
```
http://localhost:3000
```

**Ventajas:**
- ✅ Carga la API key automáticamente desde `.env.local`
- ✅ Sirve la aplicación web completa
- ✅ Más fácil de usar

---

### Opción 2: Usar Solo el Proxy

**Terminal 1 - Iniciar el proxy:**
```bash
cd ~/Documentos/wed/english-gaming-vocab/server
node proxy.js
```

**Terminal 2 - Iniciar servidor web:**
```bash
cd ~/Documentos/wed/english-gaming-vocab
python -m http.server 8000
```

Luego abre en el navegador:
```
http://localhost:8000
```

**Ventajas:**
- ✅ Control granular de cada servicio
- ✅ Fácil para debugging

---

## 🔒 Seguridad

**⚠️ IMPORTANTE:**

- ✅ `.env.local` está en `.gitignore` - **no se sube a GitHub**
- ✅ La clave API solo existe localmente en tu máquina
- ✅ Los servidores cargan automáticamente las variables de entorno
- ✅ En producción (Vercel), usar variables de entorno del dashboard

---

## 📝 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `.env.local` | ✨ NUEVO - Contiene `GEMINI_API_KEY` |
| `public-server.js` | ✅ Carga `.env.local` al iniciar |
| `server/proxy.js` | ✅ Carga `.env.local` al iniciar |

---

## ✅ Verificación

Una vez que inicie el servidor, deberías ver:

```
✅ Variables de entorno cargadas desde .env.local
```

Si algo falla, ejecuta:

```bash
cat .env.local
```

Deberías ver:
```
GEMINI_API_KEY=AIzaSyBd8eqsjyNFMadMrvxn4lLxQ0biZ5L2r3g
```

---

## 🎯 Próximos Pasos

1. **Inicia el servidor:**
   ```bash
   node public-server.js
   ```

2. **Abre en navegador:**
   ```
   http://localhost:3000
   ```

3. **Prueba la funcionalidad:**
   - Busca palabras de gaming
   - Usa el profesor IA
   - Genera historias
   - Todo debe funcionar sin errores

---

## ❓ Troubleshooting

**Error: "GEMINI_API_KEY no está definida"**
- ✅ Verifica que `.env.local` existe: `ls -la .env.local`
- ✅ Verifica contenido: `cat .env.local`
- ✅ Reinicia el servidor

**Error: "Cannot read property 'split' of undefined"**
- ✅ Asegúrate de que `.env.local` tiene el formato correcto
- ✅ No debe haber espacios alrededor del `=`
- ✅ Ejemplo correcto: `GEMINI_API_KEY=AIzaSyBd8eqsjyNFMadMrvxn4lLxQ0biZ5L2r3g`

**La app abre pero no responde a solicitudes de IA**
- ✅ Verifica que el proxy está corriendo: `curl http://localhost:3002/health`
- ✅ Comprueba la consola del servidor para ver los logs
- ✅ Abre DevTools (F12) en el navegador y mira la pestaña Network

---

## 🔄 Cambiar la Clave API

Si necesitas usar otra clave API:

1. Edita `.env.local`:
   ```bash
   nano .env.local
   ```

2. Reemplaza la clave:
   ```
   GEMINI_API_KEY=TU_NUEVA_CLAVE_AQUI
   ```

3. Guarda (Ctrl+O, Enter, Ctrl+X)

4. Reinicia el servidor

---

**¡Todo listo para desarrollar localmente! 🎮📚**
