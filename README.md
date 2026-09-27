# Relation Properties Checker

An interactive discrete mathematics web application and Python engine to define a finite set $A$ and a binary relation $R \subseteq A \times A$, validate domains, and rigorously verify relation properties with concrete mathematical counterexample explanations.

---

## 🚀 Features

- **Set & Relation Input**: Enter elements for set $A$ (e.g. `1, 2, 3`) and ordered pairs for relation $R$ (e.g. `(1,1), (2,2), (3,3)`).
- **Domain Validation**: Checks that all elements in $R$ belong to set $A$ with immediate feedback and inline alerts.
- **6 Core Relation Properties**:
  - **Reflexive**: $\forall a \in A, (a, a) \in R$ (identifies missing self-loops)
  - **Irreflexive**: $\forall a \in A, (a, a) \notin R$ (identifies forbidden self-loops)
  - **Symmetric**: $\forall (a, b) \in R \implies (b, a) \in R$ (shows missing transpose pairs)
  - **Antisymmetric**: $\forall (a, b), (b, a) \in R \implies a = b$ (shows conflicting reciprocal pairs $a \neq b$)
  - **Asymmetric**: $\forall (a, b) \in R \implies (b, a) \notin R$ (forbids self-loops and reciprocals)
  - **Transitive**: $\forall (a, b), (b, c) \in R \implies (a, c) \in R$ (shows missing composition pairs)
- **Equivalence Relation Status**: Highlights whether $R$ satisfies Reflexive $\land$ Symmetric $\land$ Transitive simultaneously.
- **Verification Harness**: Built-in test runner (`window.runTests()`) that validates all properties against standard presets.
- **Python Engine (`relation_and_function.py`)**: Standalone pure Python implementation of relation checker algorithms.

---

## 💻 Quick Start

### Web Application
Open `index.html` directly in any web browser, or serve locally:

```bash
# On Windows
start index.html

# Or with python http server
py -m http.server 8080
```

### Python Script
Run the mathematical analyzer in Python:

```bash
py relation_and_function.py
```

---

## 🧪 Presets Included

- **Identity**: $A = \{1, 2, 3\}$, $R = \{(1,1), (2,2), (3,3)\}$ (Equivalence relation).
- **≤ Partial Order**: $A = \{1, 2, 3\}$, $R = \{(1,1), (1,2), (1,3), (2,2), (2,3), (3,3)\}$.
- **< Strict Order**: $A = \{1, 2, 3\}$, $R = \{(1,2), (1,3), (2,3)\}$.
- **≠ Inequality**: $A = \{1, 2, 3\}$, $R = \{(1,2), (1,3), (2,1), (2,3), (3,1), (3,2)\}$.
- **Symmetric Non-Reflexive**: $A = \{1, 2, 3\}$, $R = \{(1,2), (2,1)\}$.
