// ===== MINI HISTORIAS Y DIÁLOGOS EXPANDIDOS =====

const miniStories = [
    {
        id: 1,
        title: 'The Lost Warrior',
        difficulty: 'intermediate',
        story: `A brave warrior woke up in a dark cave with no memory. He saw a sword glowing with blue light. "This weapon will help me escape!" he thought. He stood up and started walking through the corridor. Suddenly, he heard a sound. A huge dragon appeared! The warrior raised his sword and prepared to fight. His health was full, but his mana was low. He knew he had to use his special ability wisely. The dragon attacked first, dealing massive damage. The warrior dodged the attack and counterattacked. The battle lasted for hours. Finally, the warrior struck the final blow. The dragon fell, and the warrior leveled up. He found a treasure chest filled with gold coins and a legendary artifact. He was finally free!`,
        keyWords: ['warrior', 'sword', 'health', 'mana', 'ability', 'dragon', 'attack', 'dodge', 'leveled up', 'treasure', 'artifact'],
        translation: `Un valiente guerrero se despertó en una cueva oscura sin memoria. Vio una espada brillando con luz azul. "¡Esta arma me ayudará a escapar!" pensó. Se levantó y comenzó a caminar por el corredor. De repente, escuchó un sonido. ¡Un dragón enorme apareció! El guerrero levantó su espada y se preparó para luchar. Su salud estaba al máximo, pero su maná era bajo. Sabía que tenía que usar su habilidad especial sabiamente. El dragón atacó primero, infligiendo daño masivo. El guerrero esquivó el ataque y contraatacó. La batalla duró horas. Finalmente, el guerrero asestó el golpe final. El dragón cayó, y el guerrero subió de nivel. Encontró un cofre del tesoro lleno de monedas de oro y un artefacto legendario. ¡Finalmente era libre!`
    },
    {
        id: 2,
        title: 'The Merchant\'s Secret',
        difficulty: 'intermediate',
        story: `In the town square, there was a mysterious merchant. Nobody knew where he came from. Every day, he sold rare items that nobody had ever seen before. One day, a young adventurer approached him. "What is your secret?" the adventurer asked. The merchant smiled and whispered, "I come from another dimension. I trade items from different worlds." The adventurer's eyes opened wide. "Can you sell me a portal key?" The merchant nodded. "Yes, but it costs 10,000 gold coins." The adventurer worked hard for months to earn the money. Finally, he had enough gold. He bought the portal key and traveled to a magical world. There, he found his true destiny as a legendary hero.`,
        keyWords: ['merchant', 'mystery', 'rare items', 'adventurer', 'secret', 'dimension', 'trade', 'portal', 'gold coins', 'legendary'],
        translation: `En la plaza del pueblo, había un comerciante misterioso. Nadie sabía de dónde venía. Cada día, vendía objetos raros que nadie había visto antes. Un día, un joven aventurero se acercó a él. "¿Cuál es tu secreto?" preguntó el aventurero. El comerciante sonrió y susurró, "Vengo de otra dimensión. Comercio artículos de diferentes mundos". Los ojos del aventurero se abrieron. "¿Puedes venderme una llave de portal?" El comerciante asintió. "Sí, pero cuesta 10.000 monedas de oro". El aventurero trabajó duro durante meses para ganar el dinero. Finalmente, tenía suficiente oro. Compró la llave del portal y viajó a un mundo mágico. Allí, encontró su verdadero destino como un héroe legendario.`
    },
    {
        id: 3,
        title: 'The Mage\'s Tower',
        difficulty: 'advanced',
        story: `High above the clouds stood an ancient tower controlled by a powerful mage. The mage possessed knowledge of elemental magic: fire, ice, and lightning. Many adventurers tried to reach the tower, but they all failed. One day, a young mage with potential arrived. She climbed the tower, facing magical traps and elemental guardians. On each floor, she learned new spells and gained experience. When she reached the top, the ancient mage tested her. He cast a powerful spell, but she managed to counter it with perfect precision. The ancient mage smiled. "You are worthy. Take my staff and become the new guardian of this tower." The young mage accepted her new role and became one of the most respected wizards in the realm.`,
        keyWords: ['tower', 'mage', 'elemental', 'magic', 'fire', 'ice', 'lightning', 'adventurer', 'spells', 'guardian', 'wizard'],
        translation: `Por encima de las nubes se erguía una antigua torre controlada por un mago poderoso. El mago poseía conocimiento de magia elemental: fuego, hielo y rayo. Muchos aventureros intentaron llegar a la torre, pero todos fracasaron. Un día, llegó una joven maga con potencial. Subió la torre, enfrentándose a trampas mágicas y guardianes elementales. En cada piso, aprendió nuevos hechizos y ganó experiencia. Cuando llegó a la cima, el mago antiguo la probó. Lanzó un hechizo poderoso, pero ella logró contrarrestarlo con precisión perfecta. El mago antiguo sonrió. "Eres digna. Toma mi personal y conviértete en la nueva guardiana de esta torre". La joven maga aceptó su nuevo rol y se convirtió en una de las magos más respetadas del reino.`
    },
    {
        id: 4,
        title: 'The Healer\'s Quest',
        difficulty: 'beginner',
        story: `A kind healer lived in a small village. Every day, she healed sick people and injured adventurers. One day, a dying knight came to her door. "Please," he said, "I need a cure potion to save my life." The healer didn't have the cure, so she decided to find the ingredients. She traveled through forests, mountains, and rivers. She fought monsters, avoided traps, and solved puzzles. Finally, she gathered all the ingredients. She crafted the special potion with all her love. When the knight drank it, he recovered instantly. He became very strong and decided to protect the village. Now, the village was safe and the healer was happy.`,
        keyWords: ['healer', 'potion', 'knight', 'ingredients', 'craft', 'cure', 'monsters', 'protect'],
        translation: `Una sanadora amable vivía en un pequeño pueblo. Cada día, curaba a personas enfermas y aventureros heridos. Un día, un caballero moribundo llegó a su puerta. "Por favor", dijo, "necesito una poción de cura para salvar mi vida". La sanadora no tenía la cura, así que decidió encontrar los ingredientes. Viajó a través de bosques, montañas y ríos. Luchó contra monstruos, evitó trampas y resolvió acertijos. Finalmente, reunió todos los ingredientes. Elaboró la poción especial con todo su amor. Cuando el caballero la bebió, se recuperó al instante. Se volvió muy fuerte y decidió proteger el pueblo. Ahora, el pueblo estaba seguro y la sanadora era feliz.`
    }
];

const expandedDialogues = [
    {
        id: 1,
        title: 'The Blacksmith',
        npc: 'Blacksmith',
        dialogue: [
            { speaker: 'Adventurer', text: 'Hello, I heard you can upgrade my equipment.' },
            { speaker: 'Blacksmith', text: 'Indeed! I can enhance your weapons and armor. What do you have?' },
            { speaker: 'Adventurer', text: 'I have this old iron sword. Can you make it stronger?' },
            { speaker: 'Blacksmith', text: 'Of course! I need 5 iron ore and 100 gold coins. It will take one day.' },
            { speaker: 'Adventurer', text: 'Perfect! Here\'s everything you need.' },
            { speaker: 'Blacksmith', text: 'Excellent! Come back tomorrow for your legendary sword!' },
        ],
        translation: [
            { speaker: 'Aventurero', text: 'Hola, escuché que puedes mejorar mi equipo.' },
            { speaker: 'Herrero', text: '¡Claro! Puedo mejorar tus armas y armadura. ¿Qué tienes?' },
            { speaker: 'Aventurero', text: 'Tengo esta vieja espada de hierro. ¿Puedes hacerla más fuerte?' },
            { speaker: 'Herrero', text: 'Claro. Necesito 5 minerales de hierro y 100 monedas de oro. Tardará un día.' },
            { speaker: 'Aventurero', text: 'Perfecto! Aquí está todo lo que necesitas.' },
            { speaker: 'Herrero', text: '¡Excelente! ¡Vuelve mañana por tu espada legendaria!' },
        ]
    },
    {
        id: 2,
        title: 'The Tavern Master',
        npc: 'Tavern Master',
        dialogue: [
            { speaker: 'Traveler', text: 'I need a room for the night. Do you have any available?' },
            { speaker: 'Tavern Master', text: 'Welcome, friend! We have plenty of rooms. It costs 50 gold per night.' },
            { speaker: 'Traveler', text: 'That\'s reasonable. I also need information about the dungeon nearby.' },
            { speaker: 'Tavern Master', text: 'Ah, many adventurers ask about it. It\'s dangerous, but there\'s treasure inside.' },
            { speaker: 'Traveler', text: 'Have you been there?' },
            { speaker: 'Tavern Master', text: 'No, it\'s too risky. But many heroes say there\'s a dragon guarding the treasure.' },
        ],
        translation: [
            { speaker: 'Viajero', text: 'Necesito una habitación por la noche. ¿Tienen disponible?' },
            { speaker: 'Dueño de Taberna', text: '¡Bienvenido, amigo! Tenemos muchas habitaciones. Cuesta 50 monedas por noche.' },
            { speaker: 'Viajero', text: 'Es razonable. También necesito información sobre la mazmorra cercana.' },
            { speaker: 'Dueño de Taberna', text: 'Ah, muchos aventureros preguntan. Es peligrosa, pero hay tesoro adentro.' },
            { speaker: 'Viajero', text: '¿Has estado allí?' },
            { speaker: 'Dueño de Taberna', text: 'No, es muy arriesgado. Pero muchos héroes dicen que hay un dragón protegiendo el tesoro.' },
        ]
    },
    {
        id: 3,
        title: 'The Wise Sage',
        npc: 'Sage',
        dialogue: [
            { speaker: 'Student', text: 'Wise sage, I seek knowledge about magic.' },
            { speaker: 'Sage', text: 'Magic is not learned, it is understood. What element calls to you?' },
            { speaker: 'Student', text: 'I am interested in fire magic.' },
            { speaker: 'Sage', text: 'Fire is passionate and destructive. But also purifying and warming.' },
            { speaker: 'Student', text: 'How do I master fire magic?' },
            { speaker: 'Sage', text: 'First, meditate. Feel the heat within your soul. Then practice simple spells: fireball, flame strike.' },
            { speaker: 'Student', text: 'Thank you for your wisdom!' },
            { speaker: 'Sage', text: 'You have potential, young one. Return when you need guidance.' },
        ],
        translation: [
            { speaker: 'Estudiante', text: 'Sabio sabio, busco conocimiento sobre magia.' },
            { speaker: 'Sabio', text: 'La magia no se aprende, se entiende. ¿Qué elemento te llama?' },
            { speaker: 'Estudiante', text: 'Estoy interesado en magia de fuego.' },
            { speaker: 'Sabio', text: 'El fuego es apasionado y destructivo. Pero también purificador y cálido.' },
            { speaker: 'Estudiante', text: '¿Cómo domino la magia de fuego?' },
            { speaker: 'Sabio', text: 'Primero, medita. Siente el calor dentro de tu alma. Luego practica hechizos simples: bola de fuego, golpe de llama.' },
            { speaker: 'Estudiante', text: '¡Gracias por tu sabiduría!' },
            { speaker: 'Sabio', text: 'Tienes potencial, joven. Vuelve cuando necesites orientación.' },
        ]
    },
    {
        id: 4,
        title: 'The Guild Master',
        npc: 'Guild Master',
        dialogue: [
            { speaker: 'Adventurer', text: 'I want to join the Adventurers Guild.' },
            { speaker: 'Guild Master', text: 'Welcome! To join, you must complete a trial mission.' },
            { speaker: 'Adventurer', text: 'What is the mission?' },
            { speaker: 'Guild Master', text: 'Defeat 10 goblins in the nearby forest and bring me proof.' },
            { speaker: 'Adventurer', text: 'I accept the challenge!' },
            { speaker: 'Guild Master', text: 'Good! You\'ll receive 500 gold and a guild badge. Good luck!' },
        ],
        translation: [
            { speaker: 'Aventurero', text: 'Quiero unirme al Gremio de Aventureros.' },
            { speaker: 'Maestro del Gremio', text: '¡Bienvenido! Para unirte, debes completar una misión de prueba.' },
            { speaker: 'Aventurero', text: '¿Cuál es la misión?' },
            { speaker: 'Maestro del Gremio', text: 'Derrota 10 goblins en el bosque cercano y tráeme prueba.' },
            { speaker: 'Aventurero', text: '¡Acepto el desafío!' },
            { speaker: 'Maestro del Gremio', text: '¡Bien! Recibirás 500 monedas de oro y una insignia del gremio. ¡Buena suerte!' },
        ]
    }
];

// Mostrar historia expandida
function displayMiniStory(storyId) {
    const story = miniStories.find(s => s.id === storyId);
    if (!story) {
        console.error('Historia no encontrada:', storyId);
        return;
    }
    
    const container = document.getElementById('storyDetailContainer');
    if (!container) {
        console.error('Contenedor storyDetailContainer no encontrado');
        return;
    }
    
    const grid = document.getElementById('storiesGrid');
    grid.style.display = 'none';
    container.style.display = 'block';
    
    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); 
                    padding: 30px; border-radius: 10px; border: 2px solid var(--accent-color);">
            <h2 style="color: var(--accent-color); margin-bottom: 15px;">📖 ${story.title}</h2>
            <div style="background-color: var(--secondary-color); padding: 20px; 
                        border-left: 4px solid var(--success-color); border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: var(--success-color); margin-bottom: 10px;">🇬🇧 English:</h3>
                <p style="color: var(--text-color); line-height: 1.8; font-size: 1em;">${story.story}</p>
            </div>
            
            <div style="background-color: var(--secondary-color); padding: 20px; 
                        border-left: 4px solid var(--accent-color); border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: var(--accent-color); margin-bottom: 10px;">🔑 Palabras Clave:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${story.keyWords.map(word => `<span style="background: var(--primary-color); 
                        padding: 5px 10px; border-radius: 3px; color: var(--success-color); 
                        border: 1px solid var(--accent-color);">${word}</span>`).join('')}
                </div>
            </div>
            
            <div style="background-color: var(--secondary-color); padding: 20px; 
                        border-left: 4px solid var(--danger-color); border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: var(--danger-color); margin-bottom: 10px;">🇪🇸 Español:</h3>
                <p style="color: var(--text-color); line-height: 1.8; font-style: italic;">${story.translation}</p>
            </div>
            
            <div style="background-color: var(--secondary-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                <p style="color: var(--text-color); font-size: 0.9em;"><strong>Dificultad:</strong> ${story.difficulty}</p>
            </div>
            
            <button class="btn-submit" onclick="goBackToStories()" style="margin-top: 20px; width: 100%;">
                ← Volver a las Historias
            </button>
        </div>
    `;
}

// Mostrar diálogo expandido
function displayDialogue(dialogueId) {
    const dialogue = expandedDialogues.find(d => d.id === dialogueId);
    if (!dialogue) {
        console.error('Diálogo no encontrado:', dialogueId);
        return;
    }
    
    const container = document.getElementById('dialogueDetailContainer');
    if (!container) {
        console.error('Contenedor dialogueDetailContainer no encontrado');
        return;
    }
    
    const grid = document.getElementById('dialoguesGrid');
    grid.style.display = 'none';
    container.style.display = 'block';
    
    let dialogueHTML = `
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); 
                    padding: 30px; border-radius: 10px; border: 2px solid var(--accent-color);">
            <h2 style="color: var(--accent-color); margin-bottom: 15px;">💬 ${dialogue.title}</h2>
            
            <div style="background-color: var(--secondary-color); padding: 20px; 
                        border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: var(--accent-color); margin-bottom: 15px;">🇬🇧 English:</h3>
    `;
    
    dialogue.dialogue.forEach((line, idx) => {
        const bgColor = line.speaker === 'Adventurer' || line.speaker === 'Student' || 
                       line.speaker === 'Traveler' ? 'var(--primary-color)' : 'rgba(0, 212, 255, 0.1)';
        dialogueHTML += `
            <div style="background-color: ${bgColor}; padding: 10px; 
                        border-radius: 5px; margin-bottom: 10px; border-left: 3px solid var(--accent-color);">
                <strong style="color: var(--danger-color);">${line.speaker}:</strong>
                <p style="color: var(--text-color); margin-top: 5px;">"${line.text}"</p>
            </div>
        `;
    });
    
    dialogueHTML += `</div><div style="background-color: var(--secondary-color); padding: 20px; border-radius: 5px;">
                <h3 style="color: var(--danger-color); margin-bottom: 15px;">🇪🇸 Español:</h3>
    `;
    
    dialogue.translation.forEach((line, idx) => {
        const bgColor = line.speaker.includes('Aventurero') || line.speaker.includes('Estudiante') || 
                       line.speaker.includes('Viajero') ? 'var(--primary-color)' : 'rgba(255, 0, 110, 0.1)';
        dialogueHTML += `
            <div style="background-color: ${bgColor}; padding: 10px; 
                        border-radius: 5px; margin-bottom: 10px; border-left: 3px solid var(--danger-color);">
                <strong style="color: var(--accent-color);">${line.speaker}:</strong>
                <p style="color: var(--text-color); margin-top: 5px;">"${line.text}"</p>
            </div>
        `;
    });
    
    dialogueHTML += `
            </div>
            <button class="btn-submit" onclick="goBackToDialogues()" style="margin-top: 20px; width: 100%;">
                ← Volver a los Diálogos
            </button>
        </div>
    `;
    
    container.innerHTML = dialogueHTML;
}

// Volver a las historias
function goBackToStories() {
    const container = document.getElementById('storyDetailContainer');
    const grid = document.getElementById('storiesGrid');
    if (container && grid) {
        container.style.display = 'none';
        grid.style.display = 'grid';
    }
}

// Volver a los diálogos
function goBackToDialogues() {
    const container = document.getElementById('dialogueDetailContainer');
    const grid = document.getElementById('dialoguesGrid');
    if (container && grid) {
        container.style.display = 'none';
        grid.style.display = 'grid';
    }
}

// Volver al vocabulario (compatible con versión anterior)
function goBackToVocab() {
    filterVocabulary();
}
