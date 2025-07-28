# Dual N Back

A cognitive training game built with **Svelte 5**, styled using **Tailwind CSS** and **DaisyUI**.
The Dual N-Back task is a neuroscience-based game that challenges your **working memory** by requiring players to remember both visual and auditory sequences over time.

---

## What is Dual N-Back?

Dual N-Back is a psychological task used to improve working memory and fluid intelligence.
You’re presented with a **sequence of visual and auditory stimuli**, and your goal is to recall if the **current stimulus matches the one from N steps earlier**.

For example:

* **Visual**: A square appears in one of 8 positions.
* **Auditory**: A letter is played through audio.

If either matches what appeared **N items ago**, you must respond by pressing the appropriate key.

---

## Getting Started

### Prerequisites

Make sure you have **Node.js (>=18)** and **npm** installed.

### Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

### Development Server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## Tech Stack

* **Svelte 5** (with `svelte:head`, `@html`, and new runes features)
* **Tailwind CSS** for utility-first styling
* **DaisyUI** for pre-styled components and themes
* Vite for lightning-fast bundling

---

## Contribution Guide

If you'd like to contribute to this project, here's how you can do it:

1. **Fork** the repository.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/your-username/your-fork.git
   ```
3. **Create a branch** for your feature or fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**, and ensure it works with `npm run dev`.
5. **Commit your changes** with clear messages.
6. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request** explaining what your change does and why.

Thank you for contributing!

---

## Requesting Features and Reporting Issues

If you want to request a feature or report an issue, please do so by creating an issue in the [Issues tab](../../issues).
If you need to reach out directly, my email and LinkedIn can be found on my [GitHub profile](../../).

---

## Roadmap
### Required for 1.0.0
- [ ] Game logic
    - [x] Sequence generation
    - [x] Visual stimuli
    - [ ] Audio stimuli
- [x] Settings Modal
    - [x] On click outside modal close
    - [x] Insert settings for N value
    - [ ] ~Rework settings to use a more resilient solution -> to generate UI code and to add less when updating or changing code -> svelte is not deeply reactive therefore I need to use OOP~ reworking settings is too much complication for this small app
    - [ ] save settings to local storage
- [x] Icons
- [x] fix bug where the game doesn't display letters after it is stopped -> fixed by adding new AbortController
- [x] grid reset on stop

### After 1.0.0
- [ ] Maybe some form of statistics over time
- [ ] Refine Randomness and sequences
- [ ] Reactive
- [ ] Button instant feedback if the response was correct or not
- [ ] Button pulse animation
- [ ] Translation support


### Mobile release
- [ ] Install Capacitor

---

# References

[1] S. M. Jaeggi et al., “Does excessive memory load attenuate activation in the prefrontal cortex? Load-dependent processing in single and dual tasks: functional magnetic resonance imaging study,” NeuroImage, vol. 19, no. 2, pp. 210–225, Jun. 2003, doi: 10.1016/S1053-8119(03)00098-3.

