/**
 * Relation & Function Maths Analyzer
 * Discrete Mathematics Analyzer for Binary Relations and Functions on Finite Sets
 * Features implementations based on exact discrete math definitions.
 */

(function () {
  'use strict';

  // --- Preset Definitions ---
  const PRESETS = {
    identity: {
      name: 'Identity on {1, 2, 3}',
      setA: '1, 2, 3',
      relationR: '(1,1), (2,2), (3,3)',
      expectedRelation: {
        reflexive: true,
        irreflexive: false,
        symmetric: true,
        asymmetric: false,
        antisymmetric: true,
        transitive: true,
        equivalence: true
      },
      expectedFunction: {
        isFunction: true,
        injective: true,
        surjective: true,
        bijective: true
      }
    },
    shift: {
      name: 'Shift Permutation {1→2, 2→3, 3→1}',
      setA: '1, 2, 3',
      relationR: '(1,2), (2,3), (3,1)',
      expectedRelation: {
        reflexive: false,
        irreflexive: true,
        symmetric: false,
        asymmetric: true,
        antisymmetric: true,
        transitive: false,
        equivalence: false
      },
      expectedFunction: {
        isFunction: true,
        injective: true,
        surjective: true,
        bijective: true
      }
    },
    leq: {
      name: '≤ Partial Order on {1, 2, 3}',
      setA: '1, 2, 3',
      relationR: '(1,1), (1,2), (1,3), (2,2), (2,3), (3,3)',
      expectedRelation: {
        reflexive: true,
        irreflexive: false,
        symmetric: false,
        asymmetric: false,
        antisymmetric: true,
        transitive: true,
        equivalence: false
      },
      expectedFunction: {
        isFunction: false,
        injective: false,
        surjective: false,
        bijective: false
      }
    },
    lt: {
      name: '< Strict Order on {1, 2, 3}',
      setA: '1, 2, 3',
      relationR: '(1,2), (1,3), (2,3)',
      expectedRelation: {
        reflexive: false,
        irreflexive: true,
        symmetric: false,
        asymmetric: true,
        antisymmetric: true,
        transitive: true,
        equivalence: false
      },
      expectedFunction: {
        isFunction: false,
        injective: false,
        surjective: false,
        bijective: false
      }
    },
    constant: {
      name: 'Constant Function f(x)=2',
      setA: '1, 2, 3',
      relationR: '(1,2), (2,2), (3,2)',
      expectedRelation: {
        reflexive: false,
        irreflexive: false,
        symmetric: false,
        asymmetric: false,
        antisymmetric: true,
        transitive: true,
        equivalence: false
      },
      expectedFunction: {
        isFunction: true,
        injective: false,
        surjective: false,
        bijective: false
      }
    },
    multivalue: {
      name: 'Multi-Valued (Not a Function)',
      setA: '1, 2, 3',
      relationR: '(1,1), (1,2), (2,3), (3,3)',
      expectedRelation: {
        reflexive: false,
        irreflexive: false,
        symmetric: false,
        asymmetric: false,
        antisymmetric: true,
        transitive: false,
        equivalence: false
      },
      expectedFunction: {
        isFunction: false,
        injective: false,
        surjective: false,
        bijective: false
      }
    }
  };

  // --- Helper: Pair Key Serialization ---
  function pairKey(u, v) {
    return `${u}\u001F${v}`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- Parsing & Validation ---

  function parseSet(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') {
      return { ok: false, error: 'Please enter elements for set A.' };
    }
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

  function parseRelation(rawInput, setA) {
    if (typeof rawInput !== 'string') {
      return { ok: false, error: 'Please enter pairs for relation R.' };
    }
    let cleaned = rawInput.trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      cleaned = cleaned.slice(1, -1).trim();
    }

    if (!cleaned) {
      return {
        ok: true,
        pairs: [],
        pairSet: new Set()
      };
    }

    const pairRegex = /\(\s*([^,\(\)]+?)\s*,\s*([^,\(\)]+?)\s*\)/g;
    const pairs = [];
    const pairSet = new Set();
    let match;
    let matchCount = 0;

    while ((match = pairRegex.exec(cleaned)) !== null) {
      matchCount++;
      const u = match[1].trim();
      const v = match[2].trim();

      if (!setA.has(u)) {
        return {
          ok: false,
          error: `Domain validation error: Element "${u}" in pair (${u}, ${v}) does not belong to set A = {${Array.from(setA).join(', ')}}.`
        };
      }
      if (!setA.has(v)) {
        return {
          ok: false,
          error: `Codomain validation error: Element "${v}" in pair (${u}, ${v}) does not belong to set A = {${Array.from(setA).join(', ')}}.`
        };
      }

      const key = pairKey(u, v);
      if (!pairSet.has(key)) {
        pairSet.add(key);
        pairs.push([u, v]);
      }
    }

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

  // ==========================================
  // 1. Relation Checking Algorithms
  // Exact logic matching python reference
  // ==========================================

  function checkReflexive(elements, pairSet) {
    // all((a, a) in R for a in A)
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
    // all((a, a) not in R for a in A)
    for (const a of elements) {
      if (pairSet.has(pairKey(a, a))) {
        return {
          holds: false,
          counterexample: `(${a}, ${a}) ∈ R`,
          explanation: `Not irreflexive: Contains self-loop (${a}, ${a}) ∈ R.`
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
    // all((b, a) in R for (a, b) in R)
    for (const [a, b] of pairs) {
      if (!pairSet.has(pairKey(b, a))) {
        return {
          holds: false,
          counterexample: `(${a}, ${b}) ∈ R but (${b}, ${a}) ∉ R`,
          explanation: `Not symmetric: (${a}, ${b}) ∈ R but transposed pair (${b}, ${a}) ∉ R.`
        };
      }
    }
    return {
      holds: true,
      counterexample: null,
      explanation: 'Symmetric: For every (a, b) ∈ R, (b, a) ∈ R holds.'
    };
  }

  function checkAntisymmetric(pairs, pairSet) {
    // all(a == b for (a, b) in R if (b, a) in R)
    for (const [a, b] of pairs) {
      if (a !== b && pairSet.has(pairKey(b, a))) {
        return {
          holds: false,
          counterexample: `both (${a}, ${b}) ∈ R and (${b}, ${a}) ∈ R with ${a} ≠ ${b}`,
          explanation: `Not antisymmetric: Both (${a}, ${b}) ∈ R and (${b}, ${a}) ∈ R for distinct elements ${a} ≠ ${b}.`
        };
      }
    }
    return {
      holds: true,
      counterexample: null,
      explanation: 'Antisymmetric: Whenever (a, b) ∈ R and (b, a) ∈ R, a = b.'
    };
  }

  function checkAsymmetric(pairs, pairSet) {
    // all((b, a) not in R for (a, b) in R)
    for (const [a, b] of pairs) {
      if (pairSet.has(pairKey(b, a))) {
        if (a === b) {
          return {
            holds: false,
            counterexample: `(${a}, ${a}) ∈ R`,
            explanation: `Not asymmetric: Contains diagonal pair (${a}, ${a}) ∈ R (asymmetry forbids self-loops and reciprocal pairs).`
          };
        } else {
          return {
            holds: false,
            counterexample: `both (${a}, ${b}) ∈ R and (${b}, ${a}) ∈ R`,
            explanation: `Not asymmetric: Both (${a}, ${b}) ∈ R and reciprocal (${b}, ${a}) ∈ R exist.`
          };
        }
      }
    }
    return {
      holds: true,
      counterexample: null,
      explanation: 'Asymmetric: For every (a, b) ∈ R, (b, a) ∉ R holds.'
    };
  }

  function checkTransitive(pairs, pairSet) {
    // for (a, b) in R: for (c, d) in R: if b == c and (a, d) not in R: return False
    for (const [a, b] of pairs) {
      for (const [c, d] of pairs) {
        if (b === c) {
          if (!pairSet.has(pairKey(a, d))) {
            return {
              holds: false,
              counterexample: `(${a}, ${b}) ∈ R and (${b}, ${d}) ∈ R, but (${a}, ${d}) ∉ R`,
              explanation: `Not transitive: (${a}, ${b}) ∈ R and (${b}, ${d}) ∈ R, but the composition bridge (${a}, ${d}) ∉ R.`
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

  // ==========================================
  // 2. Function Checking Algorithms
  // ==========================================

  function checkFunction(elementsA, pairs) {
    const map = new Map();
    for (const a of elementsA) {
      map.set(a, []);
    }

    for (const [u, v] of pairs) {
      if (map.has(u)) {
        map.get(u).push(v);
      }
    }

    // Check 1: Multi-mapping violation (not well-defined)
    for (const [a, outputs] of map.entries()) {
      if (outputs.length > 1) {
        return {
          holds: false,
          counterexample: `Element "${a}" maps to multiple outputs: {${outputs.map(b => `(${a}, ${b})`).join(', ')}}`,
          explanation: `Not a function: Violates uniqueness. Element "${a}" ∈ A has multiple images.`,
          mappings: map,
          range: new Set(pairs.map(p => p[1])),
          domain: new Set(pairs.map(p => p[0]))
        };
      }
    }

    // Check 2: Unmapped element violation (totality)
    for (const [a, outputs] of map.entries()) {
      if (outputs.length === 0) {
        return {
          holds: false,
          counterexample: `Element "${a}" ∈ A has no mapped image in R`,
          explanation: `Not a function: Violates totality. Every element in domain A must have an image.`,
          mappings: map,
          range: new Set(pairs.map(p => p[1])),
          domain: new Set(pairs.map(p => p[0]))
        };
      }
    }

    const range = new Set(pairs.map(p => p[1]));
    const domain = new Set(pairs.map(p => p[0]));

    return {
      holds: true,
      counterexample: null,
      explanation: `Valid function f: A → A. Every element in A maps to exactly one image in A.`,
      mappings: map,
      range: range,
      domain: domain
    };
  }

  function checkInjective(elementsA, pairs, funcRes) {
    if (!funcRes.holds) {
      return {
        holds: false,
        counterexample: 'Relation is not a valid function',
        explanation: 'Injectivity is only defined for valid functions.'
      };
    }

    const imageMap = new Map();
    for (const [a, b] of pairs) {
      if (!imageMap.has(b)) {
        imageMap.set(b, []);
      }
      imageMap.get(b).push(a);
    }

    for (const [b, preimages] of imageMap.entries()) {
      if (preimages.length > 1) {
        return {
          holds: false,
          counterexample: `Distinct inputs {${preimages.join(', ')}} map to the same output "${b}": ${preimages.map(a => `(${a}, ${b})`).join(', ')}`,
          explanation: `Not injective (one-to-one): Multiple inputs map to the same image "${b}".`
        };
      }
    }

    return {
      holds: true,
      counterexample: null,
      explanation: 'Injective (One-to-One): No two distinct elements in domain map to the same output.'
    };
  }

  function checkSurjective(elementsA, pairs, funcRes) {
    if (!funcRes.holds) {
      return {
        holds: false,
        counterexample: 'Relation is not a valid function',
        explanation: 'Surjectivity is only defined for valid functions.'
      };
    }

    const range = funcRes.range;
    const missingInCodomain = elementsA.filter(y => !range.has(y));

    if (missingInCodomain.length > 0) {
      return {
        holds: false,
        counterexample: `Elements {${missingInCodomain.join(', ')}} in codomain A have no preimages`,
        explanation: `Not surjective (onto): Codomain elements {${missingInCodomain.join(', ')}} are not in Range(f).`
      };
    }

    return {
      holds: true,
      counterexample: null,
      explanation: 'Surjective (Onto): Every element in codomain A is mapped to (Range = Codomain).'
    };
  }

  function checkBijective(funcRes, injRes, surjRes) {
    if (!funcRes.holds) {
      return {
        holds: false,
        counterexample: 'Not a function',
        explanation: 'Not bijective because the relation is not a valid function.'
      };
    }
    if (injRes.holds && surjRes.holds) {
      return {
        holds: true,
        counterexample: null,
        explanation: 'Bijective (One-to-One Correspondence): Function is both Injective and Surjective (invertible).'
      };
    }
    const failed = [];
    if (!injRes.holds) failed.push('Injective');
    if (!surjRes.holds) failed.push('Surjective');
    return {
      holds: false,
      counterexample: `Fails ${failed.join(' and ')}`,
      explanation: `Not bijective: Function fails ${failed.join(' and ')}.`
    };
  }

  // --- Aggregate Analysis ---

  function analyzeAll(elements, pairs, pairSet) {
    // 1. Relations
    const reflexive = checkReflexive(elements, pairSet);
    const irreflexive = checkIrreflexive(elements, pairSet);
    const symmetric = checkSymmetric(pairs, pairSet);
    const antisymmetric = checkAntisymmetric(pairs, pairSet);
    const asymmetric = checkAsymmetric(pairs, pairSet);
    const transitive = checkTransitive(pairs, pairSet);
    const equivalence = checkEquivalence(reflexive, symmetric, transitive);

    // 2. Functions
    const func = checkFunction(elements, pairs);
    const injective = checkInjective(elements, pairs, func);
    const surjective = checkSurjective(elements, pairs, func);
    const bijective = checkBijective(func, injective, surjective);

    return {
      relation: {
        reflexive,
        irreflexive,
        symmetric,
        antisymmetric,
        asymmetric,
        transitive,
        equivalence
      },
      function: {
        isFunction: func,
        injective,
        surjective,
        bijective
      }
    };
  }

  // ==========================================
  // 3. UI Rendering & Visualizer
  // ==========================================

  const RELATION_PROPERTY_METADATA = [
    { key: 'reflexive', name: 'Reflexive', formal: '∀a ∈ A: (a, a) ∈ R' },
    { key: 'irreflexive', name: 'Irreflexive', formal: '∀a ∈ A: (a, a) ∉ R' },
    { key: 'symmetric', name: 'Symmetric', formal: '∀(a, b) ∈ R ⟹ (b, a) ∈ R' },
    { key: 'antisymmetric', name: 'Antisymmetric', formal: '∀(a, b), (b, a) ∈ R ⟹ a = b' },
    { key: 'asymmetric', name: 'Asymmetric', formal: '∀(a, b) ∈ R ⟹ (b, a) ∉ R' },
    { key: 'transitive', name: 'Transitive', formal: '∀(a, b), (b, c) ∈ R ⟹ (a, c) ∈ R' }
  ];

  const FUNCTION_PROPERTY_METADATA = [
    { key: 'isFunction', name: 'Valid Function f: A → A', formal: '∀a ∈ A, ∃!b ∈ A: (a, b) ∈ R' },
    { key: 'injective', name: 'Injective (One-to-One)', formal: '∀a₁, a₂ ∈ A: f(a₁) = f(a₂) ⟹ a₁ = a₂' },
    { key: 'surjective', name: 'Surjective (Onto)', formal: '∀b ∈ A, ∃a ∈ A: f(a) = b  (Range = Codomain)' },
    { key: 'bijective', name: 'Bijective (One-to-One Correspondence)', formal: 'Injective ∧ Surjective (Invertible)' }
  ];

  function renderRelationProperties(results) {
    const container = document.getElementById('properties-container');
    if (!container) return;

    let html = '';
    for (const prop of RELATION_PROPERTY_METADATA) {
      const res = results[prop.key];
      const isPass = res.holds;
      const statusClass = isPass ? 'passes' : 'fails';
      const statusLabel = isPass ? 'Satisfied' : 'Violated';
      const statusColorClass = isPass ? 'status-indicator-pass' : 'status-indicator-fail';

      const iconSvg = isPass
        ? `<svg class="status-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg class="status-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

      html += `
        <article class="property-card ${statusClass}" id="card-rel-${prop.key}">
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
              ? `<div class="pass-explanation">${escapeHtml(res.explanation)}</div>`
              : `<div class="counterexample-callout">
                   <span class="counterexample-badge">Counterexample</span>
                   <span class="counterexample-text">${escapeHtml(res.counterexample)}</span>
                 </div>`
            }
          </div>
        </article>
      `;
    }

    container.innerHTML = html;
  }

  function renderFunctionProperties(results) {
    const container = document.getElementById('function-properties-container');
    if (!container) return;

    let html = '';
    for (const prop of FUNCTION_PROPERTY_METADATA) {
      const res = results[prop.key];
      const isPass = res.holds;
      const statusClass = isPass ? 'passes' : 'fails';
      const statusLabel = isPass ? 'Satisfied' : 'Violated';
      const statusColorClass = isPass ? 'status-indicator-pass' : 'status-indicator-fail';

      const iconSvg = isPass
        ? `<svg class="status-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg class="status-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

      html += `
        <article class="property-card ${statusClass}" id="card-func-${prop.key}">
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
              ? `<div class="pass-explanation">${escapeHtml(res.explanation)}</div>`
              : `<div class="counterexample-callout">
                   <span class="counterexample-badge">Counterexample</span>
                   <span class="counterexample-text">${escapeHtml(res.counterexample)}</span>
                 </div>`
            }
          </div>
        </article>
      `;
    }

    container.innerHTML = html;
  }

  function renderBanners(relResults, funcResults) {
    // Equivalence Banner
    const eqBanner = document.getElementById('equivalence-banner');
    const eqBadge = document.getElementById('equivalence-badge');
    const eqDesc = document.getElementById('equivalence-desc');
    const eqIcon = document.getElementById('equivalence-status-icon');

    if (eqBanner && eqBadge && eqDesc && eqIcon) {
      const eqResult = relResults.equivalence;
      if (eqResult.holds) {
        eqBanner.className = 'equivalence-banner is-equivalence';
        eqBadge.className = 'badge badge-success';
        eqBadge.textContent = 'EQUIVALENCE RELATION';
        eqDesc.textContent = eqResult.explanation;
        eqIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else {
        eqBanner.className = 'equivalence-banner not-equivalence';
        eqBadge.className = 'badge badge-danger';
        eqBadge.textContent = 'NOT EQUIVALENCE';
        eqDesc.textContent = eqResult.explanation;
        eqIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      }
    }

    // Function Banner
    const fnBanner = document.getElementById('function-banner');
    const fnBadge = document.getElementById('function-badge');
    const fnTitle = document.getElementById('function-heading');
    const fnDesc = document.getElementById('function-desc');
    const fnIcon = document.getElementById('function-status-icon');

    if (fnBanner && fnBadge && fnTitle && fnDesc && fnIcon) {
      const isFn = funcResults.isFunction.holds;
      const isBij = funcResults.bijective.holds;
      const isInj = funcResults.injective.holds;
      const isSurj = funcResults.surjective.holds;

      if (!isFn) {
        fnBanner.className = 'function-banner not-function';
        fnBadge.className = 'badge badge-danger';
        fnBadge.textContent = 'NOT A FUNCTION';
        fnTitle.textContent = 'Relation Only (Not a Function)';
        fnDesc.textContent = funcResults.isFunction.explanation;
        fnIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      } else if (isBij) {
        fnBanner.className = 'function-banner is-function';
        fnBadge.className = 'badge badge-success';
        fnBadge.textContent = 'BIJECTIVE FUNCTION';
        fnTitle.textContent = 'Function: Bijective (1-to-1 & Onto)';
        fnDesc.textContent = 'Every element maps uniquely and covers the entire codomain. Invertible mapping.';
        fnIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else if (isInj) {
        fnBanner.className = 'function-banner is-function';
        fnBadge.className = 'badge badge-success';
        fnBadge.textContent = 'INJECTIVE FUNCTION';
        fnTitle.textContent = 'Function: Injective (One-to-One)';
        fnDesc.textContent = 'No two distinct inputs share the same output, but some codomain elements remain unmapped.';
        fnIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else if (isSurj) {
        fnBanner.className = 'function-banner is-function';
        fnBadge.className = 'badge badge-success';
        fnBadge.textContent = 'SURJECTIVE FUNCTION';
        fnTitle.textContent = 'Function: Surjective (Onto)';
        fnDesc.textContent = 'Covers all codomain elements, but some outputs have multiple inputs.';
        fnIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else {
        fnBanner.className = 'function-banner is-function';
        fnBadge.className = 'badge badge-warning';
        fnBadge.textContent = 'GENERAL FUNCTION';
        fnTitle.textContent = 'Function: Standard Mapping';
        fnDesc.textContent = 'Valid function f: A → A, but neither Injective nor Surjective.';
        fnIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
      }
    }
  }

  // --- Arrow Mapping Visualizer ---
  function renderMappingDiagram(elements, pairs) {
    const domainCol = document.getElementById('domain-nodes');
    const codomainCol = document.getElementById('codomain-nodes');
    const svg = document.getElementById('mapping-svg');
    const diagram = document.getElementById('mapping-diagram');

    if (!domainCol || !codomainCol || !svg || !diagram) return;

    // Output occurrences
    const outputCounts = new Map();
    for (const [u, v] of pairs) {
      outputCounts.set(v, (outputCounts.get(v) || 0) + 1);
    }

    // Input occurrences
    const inputCounts = new Map();
    for (const [u, v] of pairs) {
      inputCounts.set(u, (inputCounts.get(u) || 0) + 1);
    }

    // Render Domain Nodes
    domainCol.innerHTML = elements.map(a => {
      const count = inputCounts.get(a) || 0;
      let extraClass = 'node-domain';
      if (count === 0) extraClass = 'node-unmapped';
      else if (count > 1) extraClass = 'node-collision';
      return `<div class="node-item ${extraClass}" id="d-node-${escapeHtml(a)}">${escapeHtml(a)}</div>`;
    }).join('');

    // Render Codomain Nodes
    codomainCol.innerHTML = elements.map(b => {
      const count = outputCounts.get(b) || 0;
      let extraClass = 'node-codomain';
      if (count > 1) extraClass = 'node-collision';
      else if (count === 0) extraClass = 'node-unmapped';
      return `<div class="node-item ${extraClass}" id="cd-node-${escapeHtml(b)}">${escapeHtml(b)}</div>`;
    }).join('');

    // Draw SVG Arrows after layout frame
    requestAnimationFrame(() => {
      const diagramRect = diagram.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${diagramRect.width} ${diagramRect.height}`);
      svg.innerHTML = `
        <defs>
          <marker id="arrow-normal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366F1"/>
          </marker>
          <marker id="arrow-collision" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#F43F5E"/>
          </marker>
          <marker id="arrow-multi" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#F59E0B"/>
          </marker>
        </defs>
      `;

      for (const [u, v] of pairs) {
        const dElem = document.getElementById(`d-node-${u}`);
        const cdElem = document.getElementById(`cd-node-${v}`);
        if (!dElem || !cdElem) continue;

        const dRect = dElem.getBoundingClientRect();
        const cdRect = cdElem.getBoundingClientRect();

        const x1 = dRect.right - diagramRect.left;
        const y1 = dRect.top + dRect.height / 2 - diagramRect.top;
        const x2 = cdRect.left - diagramRect.left;
        const y2 = cdRect.top + cdRect.height / 2 - diagramRect.top;

        const dx = (x2 - x1) * 0.45;
        const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        const isCollision = (outputCounts.get(v) || 0) > 1;
        const isMulti = (inputCounts.get(u) || 0) > 1;

        let strokeClass = 'line-normal';
        let markerId = 'arrow-normal';

        if (isMulti) {
          strokeClass = 'line-multi';
          markerId = 'arrow-multi';
        } else if (isCollision) {
          strokeClass = 'line-collision';
          markerId = 'arrow-collision';
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('fill', 'none');
        path.setAttribute('class', `mapping-line ${strokeClass}`);
        path.setAttribute('marker-end', `url(#${markerId})`);
        svg.appendChild(path);
      }
    });
  }

  // --- UI Error Handling ---
  function showError(msg) {
    const alertBox = document.getElementById('validation-error-alert');
    const alertMsg = document.getElementById('validation-error-msg');
    if (alertBox && alertMsg) {
      alertMsg.textContent = msg;
      alertBox.classList.remove('hidden');
    }
  }

  function hideError() {
    const alertBox = document.getElementById('validation-error-alert');
    if (alertBox) {
      alertBox.classList.add('hidden');
    }
  }

  // --- Main Execution Handler ---
  function runAnalysis() {
    hideError();
    const inputSetA = document.getElementById('input-set-a');
    const inputRelationR = document.getElementById('input-relation-r');

    if (!inputSetA || !inputRelationR) return;

    const setRes = parseSet(inputSetA.value);
    if (!setRes.ok) {
      showError(setRes.error);
      return;
    }

    const relRes = parseRelation(inputRelationR.value, setRes.set);
    if (!relRes.ok) {
      showError(relRes.error);
      return;
    }

    // Update Quick Stats in Input Card
    const setSizeStat = document.getElementById('set-size-stat');
    const pairsCountStat = document.getElementById('pairs-count-stat');
    const rangeStat = document.getElementById('range-stat');
    const pairsBadge = document.getElementById('pairs-count-badge');

    if (setSizeStat) setSizeStat.textContent = setRes.elements.length;
    if (pairsCountStat) pairsCountStat.textContent = relRes.pairs.length;
    if (pairsBadge) pairsBadge.textContent = `${relRes.pairs.length} pair${relRes.pairs.length === 1 ? '' : 's'} parsed`;

    const rangeElements = Array.from(new Set(relRes.pairs.map(p => p[1])));
    if (rangeStat) {
      rangeStat.textContent = rangeElements.length > 0 ? `{${rangeElements.join(', ')}}` : '∅';
    }

    // Analyze All Properties
    const analysis = analyzeAll(setRes.elements, relRes.pairs, relRes.pairSet);

    // Render Banners & Lists
    renderBanners(analysis.relation, analysis.function);
    renderRelationProperties(analysis.relation);
    renderFunctionProperties(analysis.function);
    renderMappingDiagram(setRes.elements, relRes.pairs);
  }

  // --- Verification Harness (Task 7) ---
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

    // Test Each Preset
    for (const [key, preset] of Object.entries(PRESETS)) {
      const setRes = parseSet(preset.setA);
      const relRes = parseRelation(preset.relationR, setRes.set);
      const analysis = analyzeAll(setRes.elements, relRes.pairs, relRes.pairSet);

      // Verify Relation Properties
      for (const [propKey, expectedVal] of Object.entries(preset.expectedRelation)) {
        assertEqual(
          `[${preset.name}] Relation: ${propKey}`,
          analysis.relation[propKey].holds,
          expectedVal
        );
      }

      // Verify Function Properties
      for (const [funcKey, expectedVal] of Object.entries(preset.expectedFunction)) {
        const actualVal = (funcKey === 'isFunction') 
          ? analysis.function.isFunction.holds 
          : analysis.function[funcKey].holds;
        assertEqual(
          `[${preset.name}] Function: ${funcKey}`,
          actualVal,
          expectedVal
        );
      }
    }

    // Domain validation edge cases
    const invalidSetRes = parseSet('1, 2');
    const invalidRelRes = parseRelation('(1, 3)', invalidSetRes.set);
    assertEqual('Domain Validation: (1,3) on {1,2} fails', invalidRelRes.ok, false);

    // Empty relation edge cases
    const emptyRelRes = parseRelation('', invalidSetRes.set);
    const emptyAnalysis = analyzeAll(invalidSetRes.elements, emptyRelRes.pairs, emptyRelRes.pairSet);
    assertEqual('Empty Relation: Irreflexive', emptyAnalysis.relation.irreflexive.holds, true);
    assertEqual('Empty Relation: Reflexive is false', emptyAnalysis.relation.reflexive.holds, false);
    assertEqual('Empty Relation: Function is false (unmapped)', emptyAnalysis.function.isFunction.holds, false);

    const totalCount = results.length;
    const summary = {
      total: totalCount,
      passed: passedCount,
      failed: totalCount - passedCount,
      allPassed: passedCount === totalCount
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

    console.log(`[Verification Harness] ${passedCount}/${totalCount} assertions passed.`);
    return summary;
  }

  // Expose global methods
  window.runTests = runTests;
  window.analyzeAll = analyzeAll;
  window.runAnalysis = runAnalysis;

  // --- DOM Setup & Event Listeners ---
  document.addEventListener('DOMContentLoaded', () => {
    const btnAnalyze = document.getElementById('btn-analyze');
    const btnClear = document.getElementById('btn-clear');
    const btnRunTests = document.getElementById('btn-run-tests');
    const btnCopyPython = document.getElementById('btn-copy-python');
    const inputSetA = document.getElementById('input-set-a');
    const inputRelationR = document.getElementById('input-relation-r');

    if (btnAnalyze) {
      btnAnalyze.addEventListener('click', runAnalysis);
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (inputSetA) inputSetA.value = '';
        if (inputRelationR) inputRelationR.value = '';
        hideError();
      });
    }

    if (btnRunTests) {
      btnRunTests.addEventListener('click', () => {
        runTests();
      });
    }

    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');

        // Re-render arrows if mapping diagram becomes visible
        if (targetId === 'mapping-tab') {
          runAnalysis();
        }
      });
    });

    // Preset Chips
    const presetChips = document.querySelectorAll('.preset-chip');
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-preset');
        const preset = PRESETS[key];
        if (preset && inputSetA && inputRelationR) {
          inputSetA.value = preset.setA;
          inputRelationR.value = preset.relationR;
          runAnalysis();
        }
      });
    });

    // Copy Python Code Button
    if (btnCopyPython) {
      btnCopyPython.addEventListener('click', () => {
        const codeElem = document.getElementById('python-code-content');
        const copyText = document.getElementById('copy-text');
        if (codeElem && navigator.clipboard) {
          navigator.clipboard.writeText(codeElem.innerText).then(() => {
            if (copyText) {
              copyText.textContent = 'Copied!';
              setTimeout(() => { copyText.textContent = 'Copy Code'; }, 2000);
            }
          });
        }
      });
    }

    // Auto re-analyze on enter in input Set A
    if (inputSetA) {
      inputSetA.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runAnalysis();
      });
    }

    // Window resize triggers diagram refresh
    window.addEventListener('resize', () => {
      const mappingTab = document.getElementById('mapping-tab');
      if (mappingTab && mappingTab.classList.contains('active')) {
        runAnalysis();
      }
    });

    // Run initial analysis and tests
    runAnalysis();
  });

})();
