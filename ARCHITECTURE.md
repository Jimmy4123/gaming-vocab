# 🏗️ ARQUITECTURA DEL PROYECTO

## Estructura de Archivos

```
english-gaming-vocab/
│
├── 📄 index.html              # Página principal con toda la interfaz
├── 🎨 styles.css              # Estilos completos (Gaming Neon Theme)
│
├── ⚙️ CONFIGURACIÓN
│   └── config.js              # API key de Gemini, funciones base
│
├── 📚 DATOS
│   └── vocabulary.js          # 600+ palabras con categorías
│
├── 🤖 INTELIGENCIA ARTIFICIAL
│   ├── ai-teacher.js          # Lógica del profesor IA
│   │   └── callGeminiAPI()    # Llamadas a API Gemini
│   └── teacher-ui.js          # Interfaz del profesor
│
├── 📖 CONTENIDO EDUCATIVO
│   └── stories.js             # Historias, diálogos, mini-historias
│
├── 🎮 FUNCIONALIDADES
│   ├── script.js              # Lógica principal de vocabulario
│   └── advanced.js            # Recomendaciones + Exámenes
│
└── 📖 DOCUMENTACIÓN
    ├── README.md              # Guía completa
    ├── QUICK_START.md         # Inicio rápido
    └── ARCHITECTURE.md        # Este archivo
```

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
   ┌────▼─────┐   ┌──────▼──────┐
   │ NAVEGADOR │   │  GEMINI API │
   │ (LocalApp)│   │  (Nube ☁️)  │
   └────┬─────┘   └──────▲──────┘
        │                │
        │  index.html    │
        │  styles.css    │ Llamadas API
        │  *.js files    │
        │                │
   ┌────▼─────────────────▼─────────┐
   │     JAVASCRIPT RUNTIME          │
   │  ├─ Vocabulario Cache           │
   │  ├─ LocalStorage (Progreso)     │
   │  └─ Estado de Aplicación        │
   └─────────────────────────────────┘
```

## Módulos Principales

### 1. CONFIG.JS - Configuración
```javascript
GEMINI_API_KEY = 'AIzaSyBJGAFO9nl7STzcG_0cGs8Jyvl6yN0aZWQ'
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

Función Principal:
  callGeminiAPI(prompt, systemPrompt)
    └─> Realiza petición HTTP a Gemini
    └─> Retorna respuesta de texto
```

### 2. VOCABULARY.JS - Base de Datos
```javascript
allVocabulary = [
  { word, pronunciation, meaning, example, category },
  ...
]

Total: 600+ palabras
Categorías: 8 (Combate, Movimiento, Items, etc.)
```

### 3. SCRIPT.JS - Lógica Principal
```
Funciones Clave:
  loadStudiedWords()           // Cargar progreso del localStorage
  saveStudiedWords()           // Guardar progreso
  displayVocabulary(words)     // Mostrar palabras en tarjetas
  filterVocabulary()           // Buscar y filtrar
  toggleStudied(word)          // Marcar palabra como estudiada
  speakWord(word)              // Pronunciación con Speech API
  updateStats()                // Actualizar estadísticas
```

### 4. AI-TEACHER.JS - Profesor IA
```
Funciones Principales:
  getTeacherExplanation(word)   // Explicar palabra
  chatWithTeacher(message)      // Chat libre
  generateMiniStory(theme)      // Historias personalizadas
  generateGameDialogue(npcType) // Diálogos
  checkUserAnswer(answer)       // Evaluar respuesta
  generateExercise(category)    // Ejercicios
  analyzeStudentLevel(stats)    // Análisis inteligente

Sistema de Prompts:
  TEACHER_SYSTEM_PROMPT        // Para explicaciones
  STORY_SYSTEM_PROMPT          // Para historias
  DIALOGUE_SYSTEM_PROMPT       // Para diálogos
```

### 5. STORIES.JS - Contenido Educativo
```
Estructura de Datos:
  miniStories = [
    {
      id, title, difficulty,
      story (EN), keyWords [],
      translation (ES)
    }
  ]

  expandedDialogues = [
    {
      id, title, npc,
      dialogue [], translation []
    }
  ]

Funciones:
  displayMiniStory(id)         // Mostrar historia
  displayDialogue(id)          // Mostrar diálogo
  goBackToVocab()             // Volver al vocabulario
```

### 6. ADVANCED.JS - Recomendaciones y Exámenes
```
Algoritmo de Recomendaciones:
  getCategoryStats()          // Estadísticas por categoría
  getWeakestCategory()        // Categoría más débil
  getSmartRecommendations()   // Algoritmo inteligente
  ├─ Prioridad Alta: Categoría débil
  ├─ Prioridad Media: Nuevas palabras
  └─ Retorna top 10

Sistema de Exámenes:
  examScenarios = [...]       // Datos de exámenes
  startExam(type)             // Iniciar examen
  displayExamQuestion()       // Mostrar pregunta
  submitAnswer()              // Evaluar respuesta
  showExamResults()           // Mostrar resultados

Tipos:
  - translation (Traducir textos)
  - listening (Escuchar palabras)
  - dialogue (Completar diálogos)
```

### 7. TEACHER-UI.JS - Interfaz del Profesor
```
Funciones de Integración:
  openTeacherChat()
  openGenerateStory()
  openGenerateDialogue()
  openWordExplanation()
  analyzeMyLevel()

Funciones IA:
  sendTeacherMessage()        // Chat en tiempo real
  aiGenerateStory()           // Generar historia
  aiGenerateDialogue()        // Generar diálogo
  aiExplainWord()             // Explicar palabra
  aiAnalyzeLevel()            // Análisis inteligente

Funciones de Interfaz:
  loadStoriesTab()            // Cargar historias
  loadDialoguesTab()          // Cargar diálogos
```

## Flujo de Interacción

### Flujo 1: Aprender Vocabulario
```
Usuario
  ↓
Selecciona Tab "Vocabulario"
  ↓
Busca/Filtra palabras
  ↓
Selecciona palabra → Tarjeta
  ↓
Lee: Pronunciación + Significado + Ejemplo
  ↓
[Optional] Click 🔊 → speakWord() → Speech API
  ↓
[Optional] Click "Marcar" → toggleStudied()
  ↓
saveStudiedWords() → localStorage
  ↓
updateStats() → muestra progreso
```

### Flujo 2: Chat con IA
```
Usuario → Tab "Profesor IA"
  ↓
Escribe pregunta
  ↓
sendTeacherMessage()
  ↓
chatWithTeacher(mensaje)
  ↓
callGeminiAPI(mensaje, TEACHER_SYSTEM_PROMPT)
  ↓
HTTP POST a Gemini API
  ↓
Gemini retorna respuesta
  ↓
Mostrar en chat window
  ↓
Guardar en aiChatHistory
```

### Flujo 3: Examen
```
Usuario → Tab "Exámenes" → Selecciona tipo
  ↓
startExam(type)
  ↓
displayExamQuestion() → Mostrar pregunta
  ↓
Usuario responde
  ↓
submitAnswer()
  ↓
Evaluar respuesta (automático o con IA)
  ↓
showFeedback() + examScore++
  ↓
nextQuestion() o showResults()
```

## Gestión de Estado

### LocalStorage
```javascript
localStorage.getItem('studiedWords')     // Set JSON de palabras
localStorage.getItem('lastStudyDate')    // Último acceso
localStorage.getItem('studyHistory')     // Historial

Actualización:
  - Cada vez que marca una palabra
  - Cada vez que completa examen
  - Cada vez que accede
```

### Memoria (Runtime)
```javascript
Global Variables:
  studiedWords = Set()        // Palabras estudiadas (RAM)
  allVocabulary = Array()     // Todas las palabras
  aiChatHistory = Array()     // Historial de chat
  currentExamIndex = int      // Posición en examen
  examAnswers = Array()       // Respuestas del usuario
```

## Integración con Gemini 2.5 Flash

### Arquitectura API

```
┌─────────────┐
│   Cliente   │
│ (HTML/JS)   │
└──────┬──────┘
       │
       │ HTTP POST
       │ Content-Type: application/json
       │
       ▼
┌──────────────────────────────────┐
│   Google Generative API v1beta   │
│  /models/gemini-2.5-flash        │
│  :generateContent?key=...        │
└──────────────────────────────────┘
       │
       │ generationConfig:
       │  ├─ temperature: 0.7
       │  ├─ maxOutputTokens: 1024
       │  └─ topP: 0.95
       │
       ▼
┌──────────────────┐
│  Gemini Model    │
│  (AI Backend)    │
└────────┬─────────┘
         │
         │ Respuesta JSON
         │ └─ contents[0].parts[0].text
         │
         ▼
┌──────────────────┐
│   Mostrar en UI  │
│   (HTML)         │
└──────────────────┘
```

### Parámetros de Gemini
```javascript
contents: [{
  parts: [{ text: prompt }]
}]

generationConfig: {
  temperature: 0.7,      // Creatividad
  topK: 40,             // Diversidad
  topP: 0.95,           // Precisión
  maxOutputTokens: 1024 // Límite de salida
}
```

## Características Técnicas

### 1. Sin Dependencias Externas
```
✅ HTML5 puro
✅ CSS3 vanilla
✅ JavaScript vanilla (ES6)
✅ Sin jQuery, React, Vue, etc.
✅ Solo API de Gemini remota
```

### 2. Responsive Design
```
Breakpoints:
  Desktop: > 1200px
  Tablet: 768px - 1200px
  Mobile: < 768px

Grid responsivo:
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
```

### 3. Accesibilidad
```
✅ Navegación por teclado
✅ Alt text en imágenes
✅ Contraste suficiente
✅ Semántica HTML correcta
✅ ARIA labels donde sea necesario
```

### 4. Performance
```
Optimizaciones:
  - Cache de vocabulario en memoria
  - LocalStorage para persistencia
  - Lazy loading de contenido
  - Funciones throttled en búsqueda
  - Sin animaciones pesadas
```

## Escalabilidad Futura

### Mejoras Potenciales
```
1. Backend Server
   ├─ Base de datos (MongoDB/PostgreSQL)
   ├─ Autenticación de usuarios
   └─ Sincronización en nube

2. Más Contenido
   ├─ 1000+ palabras
   ├─ Más historias/diálogos
   └─ Generadas por IA

3. Características Avanzadas
   ├─ Spaced Repetition (SRS)
   ├─ Gamificación con puntos/medallas
   ├─ Duelos multijugador
   ├─ Integración con video games reales
   └─ API de text-to-speech mejor

4. Movilidad
   ├─ PWA (Progressive Web App)
   ├─ App nativa (Flutter)
   └─ Offline-first
```

## Seguridad

### Consideraciones
```
✅ API Key en cliente (necesario para SPA)
   → Usar restricciones por dominio en Google Cloud
   → Limitar a gemini-2.5-flash model

✅ CORS
   → Google API permite CORS desde navegadores

✅ Datos personales
   → Se guardan solo en localStorage del navegador
   → No se envían a servidores externos

⚠️ Si escalas a producción:
   → Mover API key a backend
   → Implementar rate limiting
   → Usar variables de entorno
```

## Debugging

### Consola del Navegador
```javascript
// Ver todas las palabras
console.log(allVocabulary);

// Ver palabras estudiadas
console.log(Array.from(studiedWords));

// Ver estadísticas
console.log(getCategoryStats());

// Ver historial de chat
console.log(aiChatHistory);

// Limpiar localStorage
localStorage.clear();
```

## Comandos Útiles

```bash
# Abrir en navegador (desde terminal)
open index.html                    # macOS
xdg-open index.html               # Linux
start index.html                  # Windows

# Monitorear cambios (con Live Server)
# Instalar: npm install -g live-server
live-server

# Validar HTML/CSS
# Usar: https://validator.w3.org/
# https://jigsaw.w3.org/css-validator/
```

---

**Documentación Técnica Completa**
**Última actualización: 10 de Noviembre de 2025**
