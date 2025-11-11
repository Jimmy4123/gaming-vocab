# Rotación segura de la Gemini API Key

Este documento explica cómo rotar la API key de Gemini de forma segura y desplegarla en Vercel.

1) Crear nueva clave en Google Cloud
   - Ve a Google Cloud Console → APIs & Services → Credentials
   - Create Credentials → API key
   - Restringe la clave: limita a la API de Generative Language y restringe referrers/IPs si es posible

2) Probar localmente (opcional)
   - Ejecuta el script de ayuda:

     ```bash
     # Pega la clave cuando te pida (input oculto)
     ./scripts/rotate-key.sh NEW_KEY
     # o sin argumento: ./scripts/rotate-key.sh
     ```

   - Esto creará `.env.local` con `GEMINI_API_KEY="..."` en la raíz del repo (no lo comitees).

3) Añadir la clave en Vercel (producción)
   - Panel web: Project → Settings → Environment Variables → Add
     - Name: `GEMINI_API_KEY`
     - Value: pega la clave nueva
     - Environment: `Production` (y `Preview` si lo deseas)

   - Con Vercel CLI (opcional):
     ```bash
     vercel env add GEMINI_API_KEY production
     # o (no interactivo) - si tu versión del CLI lo permite:
     printf '%s' "<NEW_KEY>" | vercel env add GEMINI_API_KEY production --confirm
     ```

4) Redeploy y verificación
   - Desde Vercel: trigger a redeploy (Import/Deploy o re-run build)
   - Verifica que el endpoint `/api/generate` responde correctamente y que la app funciona

5) Revoke / delete old key
   - Una vez verificado, revoca o borra la clave anterior en Google Cloud

Notas de seguridad
 - Nunca subas claves a GitHub. Usa variables de entorno.
 - Limita el alcance de la clave (APIs permitidas, referrers, IPs) cuando sea posible.
