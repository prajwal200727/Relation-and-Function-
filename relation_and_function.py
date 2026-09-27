"""
Relation Properties Checker
Discrete Mathematics Analyzer for Binary Relations on Finite Sets.
Includes exact mathematical implementations of core relation properties and equivalence checks,
complete with counterexample diagnostics.
"""

import sys


# ==========================================
# 1. Relation Property Checker Functions
# ==========================================

def is_relation(A, R):
    """
    A binary relation R on set A is a subset of A × A.
    ∀(a, b) ∈ R: a ∈ A and b ∈ A.
    """
    domain = set(A)
    return all(a in domain and b in domain for (a, b) in R)


def is_reflexive(A, R):
    """
    Reflexive: Every element in A is related to itself.
    ∀a ∈ A: (a, a) ∈ R
    """
    r_set = set(R)
    return all((a, a) in r_set for a in A)


def is_irreflexive(A, R):
    """
    Irreflexive: No element in A is related to itself (no self-loops).
    ∀a ∈ A: (a, a) ∉ R
    """
    r_set = set(R)
    return all((a, a) not in r_set for a in A)


def is_symmetric(R):
    """
    Symmetric: If (a, b) ∈ R, then (b, a) ∈ R.
    ∀(a, b) ∈ R: (b, a) ∈ R
    """
    r_set = set(R)
    return all((b, a) in r_set for (a, b) in R)


def is_antisymmetric(R):
    """
    Antisymmetric: If (a, b) ∈ R and (b, a) ∈ R, then a == b.
    ∀(a, b) ∈ R: if (b, a) ∈ R then a == b
    """
    r_set = set(R)
    return all(a == b for (a, b) in R if (b, a) in r_set)


def is_asymmetric(R):
    """
    Asymmetric: If (a, b) ∈ R, then (b, a) ∉ R (strictly no reciprocal pairs and no self-loops).
    ∀(a, b) ∈ R: (b, a) ∉ R
    Note: Equivalent to (Irreflexive and Antisymmetric).
    """
    r_set = set(R)
    return all((b, a) not in r_set for (a, b) in R)


def is_transitive(R):
    """
    Transitive: If (a, b) ∈ R and (b, c) ∈ R, then (a, c) ∈ R.
    ∀(a, b), (c, d) ∈ R: if b == c and (a, d) ∉ R: return False
    """
    r_set = set(R)
    for (a, b) in R:
        for (c, d) in R:
            if b == c and (a, d) not in r_set:
                return False
    return True


def is_equivalence(A, R):
    """
    Equivalence Relation: Satisfies Reflexive, Symmetric, and Transitive simultaneously.
    """
    return is_reflexive(A, R) and is_symmetric(R) and is_transitive(R)


# ==========================================
# 2. Detailed Diagnostic Analyzer
# ==========================================

def check_relation_properties(A, R):
    """
    Exhaustively evaluate all 6 relation properties + Equivalence with concrete counterexamples.
    Returns a dictionary of results.
    """
    r_set = set(R)
    pairs = list(r_set)

    # 1. Reflexive
    refl_missing = [a for a in A if (a, a) not in r_set]
    refl = {
        'holds': len(refl_missing) == 0,
        'counterexample': f"({refl_missing[0]}, {refl_missing[0]}) ∉ R" if refl_missing else None,
        'explanation': (
            f"Not reflexive: Missing self-loop ({refl_missing[0]}, {refl_missing[0]}) for element {refl_missing[0]} ∈ A."
            if refl_missing else "Reflexive: For all a ∈ A, (a, a) ∈ R holds."
        )
    }

    # 2. Irreflexive
    irrefl_loops = [a for a in A if (a, a) in r_set]
    irrefl = {
        'holds': len(irrefl_loops) == 0,
        'counterexample': f"({irrefl_loops[0]}, {irrefl_loops[0]}) ∈ R" if irrefl_loops else None,
        'explanation': (
            f"Not irreflexive: Contains self-loop ({irrefl_loops[0]}, {irrefl_loops[0]}) ∈ R."
            if irrefl_loops else "Irreflexive: For all a ∈ A, (a, a) ∉ R (no self-loops exist)."
        )
    }

    # 3. Symmetric
    symm_violation = next(((a, b) for (a, b) in pairs if (b, a) not in r_set), None)
    symm = {
        'holds': symm_violation is None,
        'counterexample': f"({symm_violation[0]}, {symm_violation[1]}) ∈ R but ({symm_violation[1]}, {symm_violation[0]}) ∉ R" if symm_violation else None,
        'explanation': (
            f"Not symmetric: ({symm_violation[0]}, {symm_violation[1]}) ∈ R but its transpose ({symm_violation[1]}, {symm_violation[0]}) ∉ R."
            if symm_violation else "Symmetric: For every (a, b) ∈ R, its transpose (b, a) ∈ R."
        )
    }

    # 4. Antisymmetric
    antisymm_violation = next(((a, b) for (a, b) in pairs if a != b and (b, a) in r_set), None)
    antisymm = {
        'holds': antisymm_violation is None,
        'counterexample': f"both ({antisymm_violation[0]}, {antisymm_violation[1]}) ∈ R and ({antisymm_violation[1]}, {antisymm_violation[0]}) ∈ R with {antisymm_violation[0]} ≠ {antisymm_violation[1]}" if antisymm_violation else None,
        'explanation': (
            f"Not antisymmetric: Both ({antisymm_violation[0]}, {antisymm_violation[1]}) and ({antisymm_violation[1]}, {antisymm_violation[0]}) exist for distinct elements."
            if antisymm_violation else "Antisymmetric: Whenever (a, b) ∈ R and (b, a) ∈ R, a = b (no distinct reciprocal pairs)."
        )
    }

    # 5. Asymmetric
    asymm_loop = next((a for a in A if (a, a) in r_set), None)
    asymm_recip = next(((a, b) for (a, b) in pairs if a != b and (b, a) in r_set), None)
    if asymm_loop is not None:
        asymm_holds = False
        asymm_ce = f"({asymm_loop}, {asymm_loop}) ∈ R"
        asymm_exp = f"Not asymmetric: Contains self-loop ({asymm_loop}, {asymm_loop}) ∈ R (asymmetry forbids all self-loops)."
    elif asymm_recip is not None:
        asymm_holds = False
        asymm_ce = f"both ({asymm_recip[0]}, {asymm_recip[1]}) ∈ R and ({asymm_recip[1]}, {asymm_recip[0]}) ∈ R"
        asymm_exp = f"Not asymmetric: Both ({asymm_recip[0]}, {asymm_recip[1]}) and reciprocal ({asymm_recip[1]}, {asymm_recip[0]}) exist."
    else:
        asymm_holds = True
        asymm_ce = None
        asymm_exp = "Asymmetric: For every (a, b) ∈ R, (b, a) ∉ R (strictly no reciprocal pairs or self-loops)."

    asymm = {'holds': asymm_holds, 'counterexample': asymm_ce, 'explanation': asymm_exp}

    # 6. Transitive
    trans_violation = None
    for (a, b) in pairs:
        for (c, d) in pairs:
            if b == c and (a, d) not in r_set:
                trans_violation = (a, b, d)
                break
        if trans_violation:
            break

    trans = {
        'holds': trans_violation is None,
        'counterexample': f"({trans_violation[0]}, {trans_violation[1]}) ∈ R and ({trans_violation[1]}, {trans_violation[2]}) ∈ R, but ({trans_violation[0]}, {trans_violation[2]}) ∉ R" if trans_violation else None,
        'explanation': (
            f"Not transitive: ({trans_violation[0]}, {trans_violation[1]}) and ({trans_violation[1]}, {trans_violation[2]}) exist, but bridge ({trans_violation[0]}, {trans_violation[2]}) ∉ R."
            if trans_violation else "Transitive: Whenever (a, b) ∈ R and (b, c) ∈ R, composition (a, c) ∈ R."
        )
    }

    # 7. Equivalence
    equiv_holds = refl['holds'] and symm['holds'] and trans['holds']
    failed_props = []
    if not refl['holds']: failed_props.append("Reflexive")
    if not symm['holds']: failed_props.append("Symmetric")
    if not trans['holds']: failed_props.append("Transitive")

    equiv = {
        'holds': equiv_holds,
        'counterexample': f"Fails: {', '.join(failed_props)}" if not equiv_holds else None,
        'explanation': (
            "Equivalence Relation: Satisfies Reflexive, Symmetric, and Transitive properties simultaneously."
            if equiv_holds else f"Not an equivalence relation: Fails {', '.join(failed_props)}."
        )
    }

    return {
        'reflexive': refl,
        'irreflexive': irrefl,
        'symmetric': symm,
        'antisymmetric': antisymm,
        'asymmetric': asymm,
        'transitive': trans,
        'equivalence': equiv
    }


# ==========================================
# 3. Demonstration & CLI Report
# ==========================================

def analyze_all(A, R):
    """
    Run complete relation analysis and print ASCII-safe report.
    """
    # Enable UTF-8 encoding on Windows terminal if supported
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    print("=" * 65)
    print("RELATION PROPERTIES MATHEMATICAL ANALYSIS")
    print("=" * 65)
    print(f"Set A (Domain)   : {set(A)}")
    print(f"Relation R       : {set(R)}")
    print("-" * 65)

    rel_props = check_relation_properties(A, R)
    print("RELATION PROPERTIES:")
    for key in ['reflexive', 'irreflexive', 'symmetric', 'antisymmetric', 'asymmetric', 'transitive', 'equivalence']:
        res = rel_props[key]
        tag = "[PASS]" if res['holds'] else "[FAIL]"
        name = key.capitalize()
        print(f"   {tag} {name:<14} : {res['holds']}")
        if not res['holds'] and res['counterexample']:
            print(f"          -> Counterexample : {res['counterexample']}")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    print("Executing Relation Properties Checker Test Suite...\n")

    # Test 1: Identity Relation (Equivalence Relation)
    A1 = {1, 2, 3}
    R1 = {(1, 1), (2, 2), (3, 3)}
    analyze_all(A1, R1)
    assert is_reflexive(A1, R1) is True
    assert is_irreflexive(A1, R1) is False
    assert is_symmetric(R1) is True
    assert is_antisymmetric(R1) is True
    assert is_asymmetric(R1) is False
    assert is_transitive(R1) is True
    assert is_equivalence(A1, R1) is True

    # Test 2: Shift / Rotation (Irreflexive, Asymmetric, Antisymmetric)
    A2 = {1, 2, 3}
    R2 = {(1, 2), (2, 3), (3, 1)}
    analyze_all(A2, R2)
    assert is_reflexive(A2, R2) is False
    assert is_irreflexive(A2, R2) is True
    assert is_symmetric(R2) is False
    assert is_antisymmetric(R2) is True
    assert is_asymmetric(R2) is True
    assert is_transitive(R2) is False
    assert is_equivalence(A2, R2) is False

    # Test 3: Partial Order <= (Reflexive, Antisymmetric, Transitive)
    A3 = {1, 2, 3}
    R3 = {(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)}
    analyze_all(A3, R3)
    assert is_reflexive(A3, R3) is True
    assert is_irreflexive(A3, R3) is False
    assert is_symmetric(R3) is False
    assert is_antisymmetric(R3) is True
    assert is_asymmetric(R3) is False
    assert is_transitive(R3) is True
    assert is_equivalence(A3, R3) is False

    # Test 4: Strict Order < (Irreflexive, Antisymmetric, Asymmetric, Transitive)
    A4 = {1, 2, 3}
    R4 = {(1, 2), (1, 3), (2, 3)}
    analyze_all(A4, R4)
    assert is_reflexive(A4, R4) is False
    assert is_irreflexive(A4, R4) is True
    assert is_symmetric(R4) is False
    assert is_antisymmetric(R4) is True
    assert is_asymmetric(R4) is True
    assert is_transitive(R4) is True
    assert is_equivalence(A4, R4) is False

    # Test 5: Symmetric Non-Reflexive
    A5 = {1, 2, 3}
    R5 = {(1, 2), (2, 1)}
    analyze_all(A5, R5)
    assert is_reflexive(A5, R5) is False
    assert is_irreflexive(A5, R5) is True
    assert is_symmetric(R5) is True
    assert is_antisymmetric(R5) is False
    assert is_asymmetric(R5) is False
    assert is_transitive(R5) is False

    print("All Relation Properties test assertions passed successfully!")
