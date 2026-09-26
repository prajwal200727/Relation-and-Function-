# Relation Properties Checker

An interactive discrete mathematics web application to define a finite set $A$ and a binary relation $R \subseteq A \times A$, validate domains, and verify relation properties with concrete counterexample explanations.

## 🚀 Features

- **Set & Relation Input**: Enter elements for set $A$ (e.g. `1, 2, 3`) and ordered pairs for relation $R$ (e.g. `(1,1), (1,2), (2,1)`).
- **Domain Validation**: Checks that all elements in $R$ belong to set $A$ and provides clear inline error alerts if any elements are invalid.
- **7 Mathematical Properties**:
  - **Reflexive**: $\forall a \in A, (a, a) \in R$ (highlights missing diagonal pairs)
  - **Irreflexive**: $\forall a \in A, (a, a) \notin R$ (highlights self-loops)
  - **Symmetric**: $\forall (a, b) \in R \implies (b, a) \in R$ (shows missing transpose pairs)
  - **Asymmetric**: $\forall (a, b) \in R \implies (b, a) \notin R$
  - **Antisymmetric**: $\forall (a, b), (b, a) \in R \implies a = b$ (shows conflicting symmetric pairs)
  - **Transitive**: $\forall (a, b), (b, c) \in R \implies (a, c) \in R$ (shows missing chain link pairs)
  - **Equivalence Relation**: Highlights whether $R$ satisfies Reflexive $\land$ Symmetric $\land$ Transitive.
- **Self-Contained & Zero Build**: Built with vanilla HTML5, CSS3, and JavaScript — runs by simply opening `index.html` or serving locally.
- **Self-Test Verification Harness**: Includes a built-in test suite (`window.runTests()`) that validates all properties against standard relations.

## 💻 Quick Start

Simply open `index.html` in any modern web browser, or serve locally:

```bash
# Python
python -m http.server 8080

# Or open directly
open index.html # On macOS / Linux
start index.html # On Windows
```
