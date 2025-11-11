# 🚀 GUÍA DE DEPLOYMENT - Gaming Vocabulary Master

> **Actualizado:** 10 de noviembre de 2025
> **Tiempo de setup:** 2-5 minutos

---

## 🎯 3 OPCIONES DE DEPLOYMENT

Elige UNA según tus preferencias:

---

## OPCIÓN 1: GitHub Pages (Recomendado ⭐)

### Ventajas
✅ Gratis
✅ Dominio personalizado (tu-nombre.github.io)
✅ SSL automático
✅ Sin mantenimiento
✅ Profesional para CV

### Pasos

**1. Crea cuenta GitHub** (si no tienes)
```
Ve a: https://github.com/signup
Llena el formulario
Confirma email
```

**2. Crea un nuevo repositorio**
```
Click en "+" (arriba a la derecha)
Selecciona "New repository"
Nombre: gaming-vocab (o lo que prefieras)
Descripción: "Gaming Vocabulary Master - Learn English with AI"
Selecciona: Public
NO hagas commits aún
Click "Create repository"
```

**3. Sube los archivos desde terminal**
```bash
cd /media/jimmy/LLAVE/wed/english-gaming-vocab

# Inicializa git
git init

# Agrega todos los archivos
git add .

# Primer commit
git commit -m "Gaming Vocabulary Master - Complete app"

# Conecta con GitHub
git remote add origin https://github.com/TU_USUARIO/gaming-vocab.git

# Cambia a rama 'main' (si es necesario)
git branch -M main

# Sube
git push -u origin main
```

**4. Habilita GitHub Pages**
```
Ve a: https://github.com/TU_USUARIO/gaming-vocab/settings
Baja hasta "Pages" (en la izquierda)
"Source" → Selecciona "main" branch
Click "Save"
Espera 30 segundos - ¡Tu sitio está en vivo!
```

**5. URL de tu proyecto**
```
https://tu-usuario.github.io/gaming-vocab/

Ejemplo si tu usuario es "juanperez":
https://juanperez.github.io/gaming-vocab/
```

**6. Comparte**
```
Tu enlace público está listo para compartir
Funciona en cualquier navegador
Actualiza con: git push origin main
```

---

## OPCIÓN 2: Netlify (Super fácil)

### Ventajas
✅ Drag and drop
✅ Dominio automático
✅ Muy rápido
✅ Interfaz simple

### Pasos

**1. Crea cuenta**
```
Ve a: https://netlify.com
Click "Sign up"
USA GitHub, Google o email
```

**2. Sube tu proyecto**
```
Opción A (Visual):
  - Ve a https://app.netlify.com
  - Arrastra la carpeta "english-gaming-vocab"
  - ¡Listo en 10 segundos!

Opción B (Desde Git):
  - Click "Import an existing project"
  - Selecciona GitHub
  - Elige el repo "gaming-vocab"
  - Click "Deploy"
```

**3. Tu URL**
```
Tu sitio estará en:
https://random-name.netlify.app

Puedes cambiar "random-name" por algo personalizado
```

**4. Actualizar**
```
Solo haz: git push origin main
Netlify actualiza automáticamente
```

---

## OPCIÓN 3: Tu propio servidor/VPS

### Para si tienes hosting propio

**Con Nginx:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    root /var/www/gaming-vocab;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Con Apache:**
```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    DocumentRoot /var/www/gaming-vocab
    
    <Directory /var/www/gaming-vocab>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Sube los archivos:**
```bash
# Via FTP o SSH
scp -r /media/jimmy/LLAVE/wed/english-gaming-vocab/* usuario@servidor:/var/www/gaming-vocab/

# O via SSH
ssh usuario@servidor
cd /var/www/gaming-vocab
git clone https://github.com/tu-usuario/gaming-vocab.git .
```

---

## ✅ VERIFICACIÓN POST-DEPLOYMENT

Después de deployer, verifica:

- [ ] La página carga sin errores
- [ ] Abre F12 → Console (no hay errores rojos)
- [ ] Puedes buscar vocabulario
- [ ] Puedes marcar palabras como estudiadas
- [ ] El progreso se guarda al recargar
- [ ] Las historias se muestran correctamente
- [ ] El botón 🔊 funciona
- [ ] El profesor IA responde (si tienes API key)
- [ ] URL compartible funciona en otro navegador

---

## 🎯 MI RECOMENDACIÓN

**Para ti:** GitHub Pages
- ✅ Es gratis
- ✅ Muy profesional
- ✅ Perfecto para portfolio
- ✅ Fácil de actualizar
- ✅ Dominio personalizado

---

## 🔄 ACTUALIZAR TU PROYECTO

Después de deployer, para actualizar:

**Opción A: Cambios menores**
```bash
cd /media/jimmy/LLAVE/wed/english-gaming-vocab
# Edita los archivos que quieras
git add .
git commit -m "Descripción del cambio"
git push origin main
# ¡Listo! Se actualiza en 30 segundos
```

**Opción B: Agregar vocabulario**
```bash
# Edita vocabulary.js
# Agrega nuevas palabras
git add vocabulary.js
git commit -m "Agregar 50 palabras nuevas"
git push origin main
```

**Opción C: Cambiar API Key**
```bash
# Edita config.js línea 2
# Reemplaza con tu API key
git add config.js
git commit -m "Update API key"
git push origin main
```

---

## 📞 PROBLEMAS COMUNES

### Error 404 en GitHub Pages
**Solución:**
- Verifica que los archivos están subidos
- Index.html debe estar en la raíz
- Espera 5 minutos, a veces tarda

### "Cannot push to repository"
**Solución:**
```bash
# Verifica credenciales
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Intenta nuevamente
git push origin main
```

### Los archivos no se actualizan
**Solución:**
```bash
# Limpia cache del navegador
Ctrl + Shift + Del (Windows)
Cmd + Shift + Del (Mac)

# O accede en incógnito
Ctrl + Shift + N (Windows)
```

### Gemini API no responde
**Solución:**
- Verifica tu API key en `config.js`
- Comprueba límite de requests (60/min)
- Recarga la página (Ctrl + F5)
- Prueba en `/api-test.html`

---

## 🎊 ¡COMPLETADO!

Tu proyecto está online y accesible globalmente.

**Próximas acciones:**
1. Comparte el link en redes sociales
2. Agrega a tu CV/portafolio
3. Pídeselo a amigos que lo prueben
4. Recibe feedback y mejora
5. ¡Celebra! 🎉

---

**¿Necesitas ayuda?** Lee INICIO_DEFINITIVO.md o TROUBLESHOOTING.md

