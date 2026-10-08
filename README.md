# Coupled cluster theory notes

Graduate-level lecture notes on coupled cluster theory, its analytic
gradients, and the multicomponent (nuclear–electronic orbital, NEO)
extension in which quantum protons are treated on the same footing as
electrons. Each set of notes is a self-contained page with typeset
equations and a matching PDF.

- `docs/html/` holds the pages. They embed their fonts and need no
  network access; clone the repository and open them in a browser.
- `docs/pdf/` holds the PDFs, which GitHub renders directly.
- `src/` holds the sources and the build pipeline; see
  [`src/README.md`](src/README.md) for how to rebuild or edit them.

## The documents, in a suggested reading order

| # | Title | What it covers | Read |
| --- | --- | --- | --- |
| 1 | Exponentials for Coupled Cluster | The twelve properties of operator exponentials that the theory rests on, each with a short proof and the place it is used | [page](docs/html/exponentials-for-coupled-cluster.html) · [pdf](docs/pdf/exponentials-for-coupled-cluster.pdf) |
| 2 | Coupled Cluster Refresher | Second quantization, the exponential ansatz, the similarity-transformed Hamiltonian, and the CCSD energy and amplitude equations as a code solves them | [page](docs/html/coupled-cluster-refresher.html) · [pdf](docs/pdf/coupled-cluster-refresher.pdf) |
| 3 | CC Energy Coefficients | Where the 1, ¼ and ½ in the CC energy formula come from, other conventions, and a check by hand | [page](docs/html/cc-energy-coefficients.html) · [pdf](docs/pdf/cc-energy-coefficients.pdf) |
| 4 | Coupled Cluster Gradients | The Lagrangian, the Λ equations, response densities, orbital relaxation through the Z-vector, and the working gradient formula | [page](docs/html/coupled-cluster-gradients.html) · [pdf](docs/pdf/coupled-cluster-gradients.pdf) |
| 5 | Gradients on One Page | A one-page summary of the gradient notes: the four equations with one-line glosses, the recipe a code follows, and four self-test questions with answers | [page](docs/html/cc-gradients-on-one-page.html) · [pdf](docs/pdf/cc-gradients-on-one-page.pdf) |
| 6 | Analytic versus Numerical Gradients | The cost of analytic and finite-difference CCSD gradients in units of one energy, accuracy, memory, and the same comparison for CCSD(T) and Hessians | [page](docs/html/analytic-vs-numerical-gradients.html) · [pdf](docs/pdf/analytic-vs-numerical-gradients.pdf) |
| 7 | Response versus Relaxation | A terminology note: orbital response as a derivative, the two different relaxations in a CC gradient, relaxed versus unrelaxed densities, and the other meanings of relaxation in the literature | [page](docs/html/orbital-response-vs-relaxation.html) · [pdf](docs/pdf/orbital-response-vs-relaxation.pdf) |
| 8 | Thouless in Multicomponent CCSD | Singles as orbital rotations, the T1-transformed Hamiltonian, what that means for a product electronic–protonic reference, and why the protonic singles are large | [page](docs/html/thouless-multicomponent-ccsd.html) · [pdf](docs/pdf/thouless-multicomponent-ccsd.pdf) |
| 9 | NEO-CCSD Energy Coefficients | Which coefficients change when the reference is a product of two determinants, and the one rule that decides | [page](docs/html/neo-ccsd-energy-coefficients.html) · [pdf](docs/pdf/neo-ccsd-energy-coefficients.pdf) |
| 10 | The Setup A Convention | The three setups for the NEO Hamiltonian and its partitioning defined by Goudy and co-workers, when each is used, why they change perturbative corrections but not CC energies, and how a Hartree-product formulation realizes Setup A | [page](docs/html/setup-a-convention.html) · [pdf](docs/pdf/setup-a-convention.pdf) |
| 11 | NEO-CCSD Amplitude Equations | The five projected equations, the counting rule for allowed terms, the leading cross terms, and the mixed doubles equation | [page](docs/html/neo-ccsd-amplitude-equations.html) · [pdf](docs/pdf/neo-ccsd-amplitude-equations.pdf) |
| 12 | NEO-CCSD Lambda Equations | Five multiplier blocks, the energy derivatives that drive them, the reversal of couplings under transposition, and the mixed response density | [page](docs/html/neo-ccsd-lambda-equations.html) · [pdf](docs/pdf/neo-ccsd-lambda-equations.pdf) |
| 13 | NEO-CCSD Gradients | The coupled electronic–protonic Z-vector equation and everything else that differs in a multicomponent analytic gradient, including the constrained variant | [page](docs/html/neo-ccsd-gradients.html) · [pdf](docs/pdf/neo-ccsd-gradients.pdf) |

Documents 1 to 7 are single-component theory and can be read on their own.
Documents 8 to 13 assume the refresher and the gradient notes and extend
them to NEO-CCSD.

## Conventions

All documents use spin orbitals, antisymmetrized same-species integrals
and unrestricted sums unless a section says otherwise, with the
single-component conventions of Crawford and Schaefer and the working
equations of Stanton, Gauss, Watts and Bartlett. Equations are numbered
consecutively within each document. Where a multicomponent equation is
shown schematically, the footer of that document says so and names the
reference against which signs and factors should be checked.
