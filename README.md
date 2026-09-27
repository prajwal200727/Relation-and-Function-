# Relation & Function Maths Analyzer

An interactive discrete mathematics suite and Python engine to define a finite set $A$ and a binary relation $R \subseteq A \times A$, validate domains, and rigorously verify relation properties and function characteristics (Injectivity, Surjectivity, Bijectivity) with concrete counterexample explanations.

## 🚀 Features

- **Set & Relation Input**: Enter elements for set $A$ (e.g. `1, 2, 3`) and ordered pairs for relation $R$ (e.g. `(1,1), (2,2), (3,3)`).
- **Domain & Codomain Validation**: Checks that all elements in $R$ belong to set $A$ with immediate feedback.
- **7 Relation Properties**:
  - **Reflexive**: $\forall a \in A, (a, a) \in R$ (highlights missing diagonal pairs)
  - **Irreflexive**: $\forall a \in A, (a, a) \notin R$ (highlights self-loops)
  - **Symmetric**: $\forall (a, b) \in R \implies (b, a) \in R$ (shows missing transpose pairs)
  - **Antisymmetric**: $\forall (a, b), (b, a) \in R \implies a = b$ (shows conflicting reciprocal pairs)
  - **Asymmetric**: $\forall (a, b) \in R \implies (b, a) \notin R$
  - **Transitive**: $\forall (a, b), (b, c) \in R \implies (a, c) \in R$ (shows missing bridge pairs)
  - **Equivalence Relation**: Highlights whether $R$ satisfies Reflexive $\land$ Symmetric $\land$ Transitive.
- **Function Analysis**:
  - **Valid Function $f: A \to A$**: Verifies Totality (every element has an image) and Well-definedness (no element maps to multiple images).
  - **Injective (One-to-One)**: Detects whether distinct domain inputs map to distinct outputs or flags collisions.
  - **Surjective (Onto)**: Verifies whether the range covers the entire codomain.
  - **Bijective**: Checks for simultaneous Injectivity and Surjectivity (one-to-one correspondence / invertibility).
- **Interactive Arrow Visualizer**: Dynamic visual bipartite graph showing mapping arrows from Domain to Codomain with status highlights.
- **Python Engine (`relation_and_function.py`)**: Standalone pure Python implementation of all relation and function checker algorithms.
- **Verification Harness**: Built-in test suite (`window.runTests()`) that validates all properties against standard presets.

## 💻 Quick Start

### Web Application
Open `index.html` directly in any web browser, or serve locally:

```bash
# On Windows
start index.html

# Or with python http server
python -m http.server 8080
```

### Python Script
Run the mathematical analyzer in Python:

```bash
python relation_and_function.py
```
