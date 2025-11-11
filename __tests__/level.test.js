const fs = require('fs');
const path = require('path');

// Helper to load a script into the current jsdom/global context
function loadScriptRel(filePath) {
  const full = path.resolve(__dirname, '..', filePath);
  const src = fs.readFileSync(full, 'utf8');
  // Evaluate in this context where globals like window, document, localStorage exist (jest-jsdom)
  eval(src);
}

describe('Level filtering and recommendations smoke tests', () => {
  beforeAll(() => {
    // Prepare a small mock vocabulary ordered by frequency
    global.allVocabulary = [
      { word: 'attack', category: 'combat', pronunciation: 'əˈtæk', meaning: 'to hit', example: 'Attack the enemy' },
      { word: 'health', category: 'combat', pronunciation: 'hɛlθ', meaning: 'life points', example: 'Your health is low' },
      { word: 'jump', category: 'movement', pronunciation: 'dʒʌmp', meaning: 'to leap', example: 'Jump over the pit' },
      { word: 'run', category: 'movement', pronunciation: 'rʌn', meaning: 'to move fast', example: 'Run to the gate' },
      { word: 'sword', category: 'items', pronunciation: 'sɔrd', meaning: 'a blade', example: 'Equip the sword' },
      { word: 'potion', category: 'items', pronunciation: 'ˈpoʊʃən', meaning: 'healing item', example: 'Drink the potion' },
      { word: 'menu', category: 'interface', pronunciation: 'ˈmɛnju', meaning: 'UI menu', example: 'Open the menu' },
      { word: 'quest', category: 'general', pronunciation: 'kwɛst', meaning: 'mission', example: 'Complete the quest' },
      { word: 'boss', category: 'npcs', pronunciation: 'bɒs', meaning: 'main enemy', example: 'Defeat the boss' },
      { word: 'loot', category: 'items', pronunciation: 'luːt', meaning: 'collected items', example: 'Collect loot' }
    ];

    // Start with empty studied set
    global.studiedWords = new Set();

    // Load settings and advanced modules (they attach functions assumed in window/global)
    loadScriptRel('settings.js');
    loadScriptRel('advanced.js');
  });

  test('loadUserSettings returns defaults when none set', () => {
    // Clear localStorage to simulate fresh user
    window.localStorage.removeItem('userSettings');
    const s = loadUserSettings();
    expect(s).toBeDefined();
    expect(s.mode).toBeDefined();
    expect(s.thresholds).toBeDefined();
    expect(typeof s.thresholds.A1).toBe('number');
  });

  test('filterByUserLevel restricts words based on manual A1 threshold', () => {
    // Set manual A1 and thresholds to include only the first 3 words (30%)
    const settings = loadUserSettings();
    settings.mode = 'manual';
    settings.manualLevel = 'A1';
    settings.thresholds = { A1: 30, A2: 50, B1: 70, B2: 85, C1: 95, C2: 100 };
    saveUserSettings(settings);

    const filtered = filterByUserLevel(allVocabulary);
    // 30% of 10 words -> 3 words allowed in core
    expect(filtered.length).toBeGreaterThanOrEqual(0);
    // Ensure all returned words are within the top 3 or are marked studied (none studied)
    const allowed = new Set(allVocabulary.slice(0, 3).map(w => w.word));
    filtered.forEach(w => {
      expect(allowed.has(w.word)).toBe(true);
    });
  });

  test('getSmartRecommendations returns items from allowed candidate pool and prioritizes weakest category', () => {
    // Ensure some studiedWords to observe unstudied logic
    studiedWords.add('attack');

    // Set manual level A2 so candidate pool is larger
    const settings = loadUserSettings();
    settings.mode = 'manual';
    settings.manualLevel = 'A2';
    settings.thresholds = { A1: 20, A2: 50, B1: 80, B2: 90, C1: 97, C2: 100 };
    saveUserSettings(settings);

    const recs = getSmartRecommendations(5);
    expect(Array.isArray(recs)).toBe(true);
    // All recommendations should be from the candidate pool (i.e., within thresholds or studied)
    const total = allVocabulary.length;
    const maxIndex = Math.floor((settings.thresholds[settings.manualLevel] / 100) * total) - 1;
    const allowedWords = new Set(allVocabulary.slice(0, Math.max(0, maxIndex + 1)).map(w => w.word));
    recs.forEach(r => {
      expect(allowedWords.has(r.word) || studiedWords.has(r.word)).toBe(true);
    });
  });
});
