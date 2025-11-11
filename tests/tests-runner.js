// Simple browser test runner for the project (no Node required)
(function(){
  const resultsEl = document.getElementById('results');
  let passed = 0, failed = 0;

  function log(msg, cls) {
    const p = document.createElement('div');
    p.innerHTML = msg;
    if (cls) p.className = cls;
    resultsEl.appendChild(p);
    console.log(msg);
  }

  function assert(cond, message) {
    if (cond) {
      passed++;
      log('✔️ ' + message, 'pass');
    } else {
      failed++;
      log('❌ ' + message, 'fail');
    }
  }

  // Wait a tick to allow any DOMContentLoaded handlers in settings.js to run
  setTimeout(() => {
    try {
      // Test 1: loadUserSettings exists and returns object
      assert(typeof loadUserSettings === 'function', 'loadUserSettings() existe');
      const s = loadUserSettings();
      assert(s && typeof s === 'object', 'loadUserSettings() devuelve objeto');

      // Test 2: filterByUserLevel exists and filters according to thresholds
      assert(typeof filterByUserLevel === 'function', 'filterByUserLevel() existe');

      // Prepare a custom settings state: manual A1 with 30% threshold
      s.mode = 'manual'; s.manualLevel = 'A1';
      s.thresholds = { A1: 30, A2: 50, B1: 70, B2: 85, C1: 95, C2: 100 };
      saveUserSettings(s);

      const filtered = filterByUserLevel(window.allVocabulary.slice());
      // 30% of 10 => first 3 words allowed
      assert(Array.isArray(filtered), 'filterByUserLevel devuelve array');
      const allowed = new Set(window.allVocabulary.slice(0,3).map(w=>w.word));
      const allInside = filtered.every(w => allowed.has(w.word));
      assert(allInside, 'Todas las palabras filtradas están dentro del top% permitido para A1');

      // Test 3: getSmartRecommendations respects allowed pool
      assert(typeof getSmartRecommendations === 'function', 'getSmartRecommendations() existe');
      // Set manual A2 bigger pool
      s.mode = 'manual'; s.manualLevel = 'A2'; s.thresholds = { A1:20, A2:50, B1:80, B2:90, C1:97, C2:100 };
      saveUserSettings(s);

      // Mark one word as studied to check behavior
      window.studiedWords.add('attack');

      const recs = getSmartRecommendations(5);
      assert(Array.isArray(recs), 'getSmartRecommendations devuelve array');

      // Verify each recommendation is within the allowed slice or is studied
      const total = window.allVocabulary.length;
      const maxIndex = Math.floor((s.thresholds[s.manualLevel]/100)*total)-1;
      const allowedSet = new Set(window.allVocabulary.slice(0, Math.max(0, maxIndex+1)).map(w=>w.word));
      const recsOk = recs.every(r => allowedSet.has(r.word) || window.studiedWords.has(r.word));
      assert(recsOk, 'Todas las recomendaciones provienen del pool permitido o son estudiadas');

      // Summary
      const summary = document.getElementById('summary');
      summary.innerHTML = `Pruebas completadas. <strong>${passed}</strong> passed, <strong>${failed}</strong> failed.`;
    } catch (e) {
      log('Error ejecutando pruebas: ' + e.message, 'fail');
      const summary = document.getElementById('summary');
      summary.innerHTML = 'Error ejecutando pruebas. Revisa la consola para más detalles.';
      console.error(e);
    }
  }, 200);
})();
