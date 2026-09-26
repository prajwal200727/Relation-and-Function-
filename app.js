/**
 * Relation Properties Checker
 * Discrete Mathematics Analyzer for Binary Relations on Finite Sets
 */

(function () {
  'use strict';

  // --- Preset Definitions ---
  const PRESETS = {
    equality: {
      name: 'Equality on {1, 2, 3}',
      setA: '1, 2, 3',
      relationR: '(1,1), (2,2), (3,3)',
      expected: {
        reflexive: true,
        irreflexive: false,
        symmetric: true,
        asymmetric: false,
        antisymmetric: true,
        transitive: true,
        equivalence: true
      }
    },
    leq: {
      name: '≤ Order on {1, 2, 3}',
      setA: '1, 2, 3',
      relationR: '(1,1), (1,2), (1,3), (2,2), (2,3), (3,3)',
      expected: {
        reflexive: true,
        irreflexive: false,
        symmetric: false,
        asymmetric: false,
        antisymmetric: true,
        transitive: true,
        equivalence: false
      }
    },
    neq: {
      name: '≠ Inequality on {1, 2, 3}',
      setA: '1, 2, 3',
      relationR: '(1,2), (1,3), (2,1), (2,3), (3,1), (3,2)',
      expected: {
        reflexive: false,
        irreflexive: true,
        symmetric: true,
        asymmetric: false,
        antisymmetric: false,
        transitive: false,
        equivalence: false
      }
    },
    custom: {
      name: 'Custom (2 ↔ 1 symmetric, non-reflexive)',
      setA: '1, 2, 3',
      relationR: '(1,2), (2,1)',
      expected: {
        reflexive: false,
        irreflexive: true,
        symmetric: true,
        asymmetric: false,
        antisymmetric: false,
        transitive: false,
        equivalence: false
      }
    }
  };

  // --- Helper: Pair Key Serialization ---
  function pairKey(u, v) {
    return `${u}\u001F${v}`;
  }

  // --- Task 2: Parsing & Validation ---

  /**
   * Parse comma-separated elements into an ordered array of unique strings
   */
  function parseSet(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') {
      return { ok: false, error: 'Please enter elements for set A.' };
    }
    // Remove outer curly braces if provided
    let cleaned = rawInput.trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      cleaned = cleaned.slice(1, -1).trim();
    }
    if (!cleaned) {
      return { ok: false, error: 'Set A cannot be empty. Enter elements like: 1, 2, 3' };
    }

    const tokens = cleaned.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (tokens.length === 0) {
      return { ok: false, error: 'Set A cannot be empty.' };
    }

    // Deduplicate preserving insertion order
    const uniqueElements = [];
    const set = new Set();
    for (const elem of tokens) {
      if (!set.has(elem)) {
        set.add(elem);
        uniqueElements.push(elem);
      }
    }

    return {
      ok: true,
      elements: uniqueElements,
      set: set
    };
  }

  /**
   * Parse relation syntax (u,v) and validate elements belong to set A
   */
  function parseRelation(rawInput, setA) {
    if (typeof rawInput !== 'string') {
      return { ok: false, error: 'Please enter pairs for relation R.' };
    }
    let cleaned = rawInput.trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      cleaned = cleaned.slice(1, -1).trim();
    }

    // Empty relation is mathematically valid on set A (empty set of pairs)
    if (!cleaned) {
      return {
        ok: true,
        pairs: [],
        pairSet: new Set()
      };
    }

    // Extract all (u, v) pairs
    const pairRegex = /\(\s*([^,\(\)]+?)\s*,\s*([^,\(\)]+?)\s*\)/g;
    const pairs = [];
    const pairSet = new Set();
    let match;
    let matchCount = 0;

    while ((match = pairRegex.exec(cleaned)) !== null) {
      matchCount++;
      const u = match[1].trim();
      const v = match[2].trim();

      // Domain validation: check elements exist in Set A
      if (!setA.has(u)) {
        return {
          ok: false,
          error: `Domain validation error: Element "${u}" in pair (${u}, ${v}) does not belong to set A = {${Array.from(setA).join(', ')}}.`
        };
      }
      if (!setA.has(v)) {
        return {
          ok: false,
          error: `Domain validation error: Element "${v}" in pair (${u}, ${v}) does not belong to set A = {${Array.from(setA).join(', ')}}.`
        };
      }

      const key = pairKey(u, v);
      if (!pairSet.has(key)) {
        pairSet.add(key);
        pairs.push([u, v]);
      }
    }

    // Verify syntax if non-empty string had no valid pairs
    if (matchCount === 0 && cleaned.length > 0) {
      return {
        ok: false,
        error: 'Invalid format. Ordered pairs must be enclosed in parentheses, e.g. (1,1), (1,2).'
      };
    }

    return {
      ok: true,
      pairs: pairs,
      pairSet: pairSet
    };
  }

  // --- Task 3 & 4: Property Checking Algorithms with Explanations & Counterexamples ---

  function checkReflexive(elements, pairSet) {
    for (const a of elements) {
      if (!pairSet.has(pairKey(a, a))) {
        return {
          holds: false,
          counterexample: `(${a}, ${a}) ∉ R`,
          explanation: `Not reflexive: (${a}, ${a}) ∉ R for element ${a} ∈ A.`
        };
      }
    }
    return {
      holds: true,
      counterexample: null,
      explanation: 'Reflexive: For all a ∈ A, (a, a) ∈ R holds.'
    };
  }

  function checkIrreflexive(elements, pairSet) {
    for (const a of elements) {
      if (pairSet.has(pairKey(a, a))) {
        return {
          holds: false,
          counterexample: `(${a}, ${a}) ∈ R`,
          explanation: `Not irreflexive: Contains reflexive loop (${a}, ${a}) ∈ R.`
        };
      }
    }
    return {
      holds: true,
      counterexample: null,
      explanation: 'Irreflexive: For all a ∈ A, (a, a) ∉ R (no self-loops).'
    };
  }

  function checkSymmetric(pairs, pairSet) {
    for (const [a, b] of pairs) {
      if (!pairSet.has(pairKey(b, a))) {
        return {
          holds: false,
          counterexample: `(${a}, ${b}) ∈ R but (${b}, ${a}) ∉ R`,
          explanation: `Not symmetric: (${a}, ${b}) ∈ R but its transpose (${b}, ${a}) ∉ R.`
        };
      }
    }
    return {
      holds: true,
      counterexample: null,
      explanation: 'Symmetric: For every (a, b) ∈ R, (b, a) ∈ R holds.'
    };
  }

  function checkAsymmetric(pairs, pairSet) {
    for (const [a, b] of pairs) {
      if (pairSet.has(pairKey(b, a))) {
        if (a === b) {
          return {
            holds: false,
            counterexample: `(${a}, ${a}) ∈ R`,
            explanation: `Not asymmetric: Contains diagonal pair (${a}, ${a}) ∈ R (asymmetry requires no reciprocal pairs including diagonal).`
          };
        } else {
          return {
            holds: false,
            counterexample: `both (${a}, ${b}) ∈ R and (${b}, ${a}) ∈ R`,
            explanation: `Not asymmetric: Both (${a}, ${b}) ∈ R and (${b}, ${a}) ∈ R.`
          };
        }
      }
    }
    return {
      holds: true,
      counterexample: null,
      explanation: 'Asymmetric: For every (a, b) ∈ R, (b, a) ∉ R.'
    };
  }

  function checkAntisymmetric(pairs, pairSet) {
    for (const [a, b] of pairs) {
      if (a !== b && pairSet.has(pairKey(b, a))) {
        return {
          holds: false,
          counterexample: `both (${a}, ${b}) ∈ R and (${b}, ${a}) ∈ R with ${a} ≠ ${b}`,
          explanation: `Not antisymmetric: (${a}, ${b}) ∈ R and (${b}, ${a}) ∈ R with distinct elements ${a} ≠ ${b}.`
        };
      }
    }
    return {
      holds: true,
      counterexample: null,
      explanation: 'Antisymmetric: Whenever (a, b) ∈ R and (b, a) ∈ R, a = b.'
    };
  }

  function checkTransitive(pairs, pairSet) {
    for (const [a, b] of pairs) {
      for (const [b2, c] of pairs) {
        if (b === b2) {
          if (!pairSet.has(pairKey(a, c))) {
            return {
              holds: false,
              counterexample: `(${a}, ${b}) ∈ R and (${b}, ${c}) ∈ R, but (${a}, ${c}) ∉ R`,
              explanation: `Not transitive: (${a}, ${b}) ∈ R and (${b}, ${c}) ∈ R, but required bridge pair (${a}, ${c}) ∉ R.`
            };
          }
        }
      }
    }
    return {
      holds: true,
      counterexample: null,
      explanation: 'Transitive: Whenever (a, b) ∈ R and (b, c) ∈ R, (a, c) ∈ R.'
    };
  }

  function checkEquivalence(refl, symm, trans) {
    const holds = refl.holds && symm.holds && trans.holds;
    if (holds) {
      return {
        holds: true,
        explanation: 'Equivalence relation: Satisfies Reflexive, Symmetric, and Transitive properties simultaneously.'
      };
    }

    const failed = [];
    if (!refl.holds) failed.push('Reflexive');
    if (!symm.holds) failed.push('Symmetric');
    if (!trans.holds) failed.push('Transitive');

    return {
      holds: false,
      explanation: `Not an equivalence relation: Fails ${failed.join(', ')}.`
    };
  }

  /**
   * Main analysis execution on parsed structures
   */
  function analyzeRelation(elements, pairs, pairSet) {
    const reflexive = checkReflexive(elements, pairSet);
    const irreflexive = checkIrreflexive(elements, pairSet);
    const symmetric = checkSymmetric(pairs, pairSet);
    const asymmetric = checkAsymmetric(pairs, pairSet);
    const antisymmetric = checkAntisymmetric(pairs, pairSet);
    const transitive = checkTransitive(pairs, pairSet);
    const equivalence = checkEquivalence(reflexive, symmetric, transitive);

    return {
      reflexive,
      irreflexive,
      symmetric,
      asymmetric,
      antisymmetric,
      transitive,
      equivalence
    };
  }

  // --- Task 5: UI Rendering (Properties List, Equivalence Banner) ---

  const PROPERTY_METADATA = [
    { key: 'reflexive', name: 'Reflexive', formal: '∀a ∈ A: (a, a) ∈ R' },
    { key: 'irreflexive', name: 'Irreflexive', formal: '∀a ∈ A: (a, a) ∉ R' },
    { key: 'symmetric', name: 'Symmetric', formal: '∀(a, b) ∈ R ⟹ (b, a) ∈ R' },
    { key: 'asymmetric', name: 'Asymmetric', formal: '∀(a, b) ∈ R ⟹ (b, a) ∉ R' },
    { key: 'antisymmetric', name: 'Antisymmetric', formal: '∀(a, b), (b, a) ∈ R ⟹ a = b' },
    { key: 'transitive', name: 'Transitive', formal: '∀(a, b), (b, c) ∈ R ⟹ (a, c) ∈ R' }
  ];

  function renderPropertiesList(results) {
    const container = document.getElementById('properties-container');
    if (!container) return;

    let html = '';
    for (const prop of PROPERTY_METADATA) {
      const res = results[prop.key];
      const isPass = res.holds;
      const statusClass = isPass ? 'passes' : 'fails';
      const statusLabel = isPass ? 'Satisfied' : 'Violated';
      const statusColorClass = isPass ? 'status-indicator-pass' : 'status-indicator-fail';

      const iconSvg = isPass
        ? `<svg class="status-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg class="status-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

      html += `
        <article class="property-card ${statusClass}" id="card-${prop.key}">
          <div class="property-header">
            <div class="property-title-col">
              <span class="property-name">${prop.name}</span>
              <span class="property-rule">${prop.formal}</span>
            </div>
            <div class="property-status-indicator ${statusColorClass}">
              ${iconSvg}
              <span>${statusLabel}</span>
            </div>
          </div>
          <div class="property-body">
            ${isPass 
              ? `<div class="pass-explanation">${res.explanation}</div>`
              : `<div class="counterexample-callout">
                   <span class="counterexample-badge">Counterexample</span>
                   <span class="counterexample-text">${res.counterexample}</span>
                 </div>`
            }
          </div>
        </article>
      `;
    }

    container.innerHTML = html;
  }

  function renderEquivalenceBanner(eqResult) {
    const banner = document.getElementById('equivalence-banner');
    const badge = document.getElementById('equivalence-badge');
    const desc = document.getElementById('equivalence-desc');
    const icon = document.getElementById('equivalence-status-icon');

    if (!banner || !badge || !desc || !icon) return;

    if (eqResult.holds) {
      banner.className = 'equivalence-banner is-equivalence';
      badge.className = 'badge badge-success';
      badge.textContent = 'EQUIVALENCE RELATION';
      desc.textContent = eqResult.explanation;
      icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else {
      banner.className = 'equivalence-banner not-equivalence';
      badge.className = 'badge badge-danger';
      badge.textContent = 'NOT EQUIVALENCE';
      desc.textContent = eqResult.explanation;
      icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }
  }

    // Render results
    renderEquivalenceBanner(results.equivalence);
    renderPropertiesList(results);
  }

  function showError(msg) {
    const alertBox = document.getElementById('validation-error-alert');
    const alertMsg = document.getElementById('validation-error-msg');
    if (alertBox && alertMsg) {
      alertMsg.textContent = msg;
      alertBox.classList.remove('hidden');
    }
  }


  // --- Task 7: Self-Tests Harness ---

  /**
   * Run programmatic assertion tests across presets and domain edge cases
   */
  function runTests() {
    const results = [];
    let passedCount = 0;

    function assertEqual(testName, actual, expected) {
      const isPass = actual === expected;
      if (isPass) passedCount++;
      results.push({
        name: testName,
        passed: isPass,
        actual: String(actual),
        expected: String(expected)
      });
      return isPass;
    }

    // Test each preset
    for (const [key, preset] of Object.entries(PRESETS)) {
      const setRes = parseSet(preset.setA);
      const relRes = parseRelation(preset.relationR, setRes.set);
      const analysis = analyzeRelation(setRes.elements, relRes.pairs, relRes.pairSet);

      for (const [propKey, expectedVal] of Object.entries(preset.expected)) {
        assertEqual(
          `Preset [${preset.name}] - ${propKey}`,
          analysis[propKey].holds,
          expectedVal
        );

        // Counterexample verification: If a property fails, ensure counterexample exists
        if (!expectedVal) {
          const hasCounterexample = (propKey === 'equivalence')
            ? (analysis.equivalence.explanation.length > 0)
            : (Boolean(analysis[propKey].counterexample) && analysis[propKey].counterexample.length > 0);
          assertEqual(
            `Preset [${preset.name}] - ${propKey} has counterexample`,
            hasCounterexample,
            true
          );
        }
      }
    }

    // Test Domain Error Validation
    const invalidSetRes = parseSet('1, 2');
    const invalidRelRes = parseRelation('(1, 3)', invalidSetRes.set);
    assertEqual(
      'Domain Validation: Pair (1,3) on Set {1,2} must fail',
      invalidRelRes.ok,
      false
    );
    assertEqual(
      'Domain Validation: Error message mentions missing element "3"',
      invalidRelRes.error.includes('3'),
      true
    );

    // Empty relation on non-empty set test
    const emptyRelRes = parseRelation('', invalidSetRes.set);
    const emptyAnalysis = analyzeRelation(invalidSetRes.elements, emptyRelRes.pairs, emptyRelRes.pairSet);
    assertEqual('Empty Relation: Irreflexive on non-empty set', emptyAnalysis.irreflexive.holds, true);
    assertEqual('Empty Relation: Reflexive on non-empty set', emptyAnalysis.reflexive.holds, false);
    assertEqual('Empty Relation: Symmetric (vacuously true)', emptyAnalysis.symmetric.holds, true);
    assertEqual('Empty Relation: Transitive (vacuously true)', emptyAnalysis.transitive.holds, true);

    const totalCount = results.length;
    const summary = {
      total: totalCount,
      passed: passedCount,
      failed: totalCount - passedCount,
      allPassed: passedCount === totalCount,
      results: results
    };

    // Render in UI
    const badge = document.getElementById('test-summary-label');
    const logBox = document.getElementById('test-results-log');
    if (badge) {
      badge.textContent = `${passedCount}/${totalCount} Passed`;
      badge.className = `test-summary-badge ${summary.allPassed ? 'all-passed' : ''}`;
    }
    if (logBox) {
      logBox.classList.remove('hidden');
      logBox.innerHTML = results.map(r => `
        <div class="test-item-row">
          <span class="test-item-name">${escapeHtml(r.name)}</span>
          <span class="test-item-result ${r.passed ? 'pass' : 'fail'}">${r.passed ? 'PASS' : 'FAIL'}</span>
        </div>
      `).join('');
    }

    console.log(`[Relation Properties Checker Tests] ${passedCount}/${totalCount} assertions passed.`);
    return summary;
  }

  // Expose runTests globally for testing & automation
  window.runTests = runTests;
  window.analyzeRelation = analyzeRelation;
  window.parseSet = parseSet;
  window.parseRelation = parseRelation;

  // --- DOM Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    const btnAnalyze = document.getElementById('btn-analyze');
    const btnClear = document.getElementById('btn-clear');
    const btnRunTests = document.getElementById('btn-run-tests');
    const inputSetA = document.getElementById('input-set-a');
    const inputRelationR = document.getElementById('input-relation-r');

    if (btnAnalyze) {
      btnAnalyze.addEventListener('click', runAnalysis);
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (inputSetA) inputSetA.value = '';
        if (inputRelationR) inputRelationR.value = '';
        const alertBox = document.getElementById('validation-error-alert');
        if (alertBox) alertBox.classList.add('hidden');
      });
    }

    if (btnRunTests) {
      btnRunTests.addEventListener('click', () => {
        runTests();
      });
    }

    // Auto re-analyze on input enter
    if (inputSetA) {
      inputSetA.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runAnalysis();
      });
    }

    // Run initial analysis
    runAnalysis();
  });

})();
