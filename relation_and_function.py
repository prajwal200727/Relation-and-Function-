"""
Relation and Function Mathematics Analyzer
Discrete Mathematics verification for Relations and Functions on Finite Sets.
Includes exact implementations of relation properties and function checks.
"""

from collections import Counter


# ==========================================
# 1. Relation Property Checker Functions
# ==========================================

def is_reflexive(A, R):
    """
    Reflexive: Every element in A is related to itself.
    ∀a ∈ A: (a, a) ∈ R
    """
    return all((a, a) in R for a in A)


def is_irreflexive(A, R):
    """
    Irreflexive: No element in A is related to itself.
    ∀a ∈ A: (a, a) ∉ R
    """
    return all((a, a) not in R for a in A)


def is_symmetric(R):
    """
    Symmetric: If (a, b) ∈ R, then (b, a) ∈ R.
    ∀(a, b) ∈ R: (b, a) ∈ R
    """
    return all((b, a) in R for (a, b) in R)


def is_antisymmetric(R):
    """
    Antisymmetric: If (a, b) ∈ R and (b, a) ∈ R, then a == b.
    ∀(a, b) ∈ R: if (b, a) ∈ R then a == b
    """
    return all(a == b for (a, b) in R if (b, a) in R)


def is_asymmetric(R):
    """
    Asymmetric: If (a, b) ∈ R, then (b, a) ∉ R (strictly no reciprocal pairs).
    ∀(a, b) ∈ R: (b, a) ∉ R
    """
    return all((b, a) not in R for (a, b) in R)


def is_transitive(R):
    """
    Transitive: If (a, b) ∈ R and (b, c) ∈ R, then (a, c) ∈ R.
    ∀(a, b), (c, d) ∈ R: if b == c and (a, d) ∉ R: return False
    """
    for (a, b) in R:
        for (c, d) in R:
            if b == c and (a, d) not in R:
                return False
    return True


def is_equivalence(A, R):
    """
    Equivalence Relation: Satisfies Reflexive, Symmetric, and Transitive.
    """
    return is_reflexive(A, R) and is_symmetric(R) and is_transitive(R)


# ==========================================
# 2. Function Property Checker Functions
# ==========================================

def is_function(A, R):
    """
    A binary relation R ⊆ A × A is a valid function f: A -> A iff:
    1. Totality: every element a ∈ A is mapped (at least one image).
    2. Well-defined / Uniqueness: every element a ∈ A maps to at most one image.
    Equivalently, each element in A appears as the first element exactly once.
    """
    domain_counts = Counter(a for (a, b) in R)
    return all(domain_counts[a] == 1 for a in A) and len(R) == len(A)


def is_injective(A, R):
    """
    Injective (One-to-One):
    Distinct elements in domain map to distinct elements in codomain.
    ∀a1, a2 ∈ A: f(a1) == f(a2) ⟹ a1 == a2.
    """
    if not is_function(A, R):
        return False
    images = [b for (a, b) in R]
    return len(images) == len(set(images))


def is_surjective(A, R, B=None):
    """
    Surjective (Onto):
    Every element in codomain (default B=A) is mapped to by at least one element in domain.
    Range(f) == Codomain.
    """
    if not is_function(A, R):
        return False
    codomain = set(A) if B is None else set(B)
    range_set = {b for (a, b) in R}
    return codomain.issubset(range_set)


def is_bijective(A, R, B=None):
    """
    Bijective (One-to-One Correspondence):
    Both Injective (One-to-One) and Surjective (Onto).
    """
    return is_injective(A, R) and is_surjective(A, R, B)


# ==========================================
# 3. Demonstration & CLI Report
# ==========================================

def analyze_all(A, R, B=None):
    """
    Run complete relation and function analysis and print formatted results.
    """
    if B is None:
        B = A

    print("=" * 60)
    print("RELATION & FUNCTION MATHEMATICAL ANALYSIS")
    print("=" * 60)
    print(f"Set A (Domain)   : {A}")
    print(f"Set B (Codomain) : {B}")
    print(f"Relation R       : {R}")
    print("-" * 60)

    # Relation Properties
    refl = is_reflexive(A, R)
    irrefl = is_irreflexive(A, R)
    symm = is_symmetric(R)
    antisymm = is_antisymmetric(R)
    asymm = is_asymmetric(R)
    trans = is_transitive(R)
    equiv = is_equivalence(A, R)

    print("1. RELATION PROPERTIES:")
    print(f"   • Reflexive     : {refl}")
    print(f"   • Irreflexive   : {irrefl}")
    print(f"   • Symmetric     : {symm}")
    print(f"   • Antisymmetric : {antisymm}")
    print(f"   • Asymmetric    : {asymm}")
    print(f"   • Transitive    : {trans}")
    print(f"   ★ Equivalence   : {equiv}")
    print("-" * 60)

    # Function Properties
    func = is_function(A, R)
    inj = is_injective(A, R)
    surj = is_surjective(A, R, B)
    bij = is_bijective(A, R, B)

    domain_set = {a for (a, b) in R}
    range_set = {b for (a, b) in R}

    print("2. FUNCTION PROPERTIES:")
    print(f"   • Valid Function : {func}")
    print(f"   • Domain         : {domain_set}")
    print(f"   • Range (Image)  : {range_set}")
    print(f"   • Injective (1-1): {inj}")
    print(f"   • Surjective(Onto): {surj}")
    print(f"   ★ Bijective (1-1 & Onto): {bij}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    # Example 1: Identity / Equivalence Relation (Bijective Function)
    A1 = {1, 2, 3}
    R1 = {(1, 1), (2, 2), (3, 3)}
    analyze_all(A1, R1)

    # Example 2: Permutation / Rotation Function f(1)=2, f(2)=3, f(3)=1
    A2 = {1, 2, 3}
    R2 = {(1, 2), (2, 3), (3, 1)}
    analyze_all(A2, R2)

    # Example 3: Partial Order <= (Relation, NOT a function due to multiple mappings)
    A3 = {1, 2, 3}
    R3 = {(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)}
    analyze_all(A3, R3)
