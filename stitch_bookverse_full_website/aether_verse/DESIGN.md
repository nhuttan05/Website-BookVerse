# Design System Strategy: The Digital Archive

## 1. Overview & Creative North Star
**Creative North Star: "The Curated Intelligence"**
This design system moves away from the cluttered, transactional nature of traditional e-commerce. Instead, it adopts an editorial, high-technology aesthetic—blending the weight of a physical archive with the fluidity of a modern digital interface. We treat every book not as a "product," but as a "discovery."

To achieve this, the system breaks the "standard grid" through **intentional asymmetry** and **tonal depth**. We leverage a generous typographic scale and a "Paper-on-Glass" layering philosophy to ensure the UI feels authoritative yet inviting. The transition from the deep Indigo (`primary-container`) to the soft Cream (`surface`) creates a sophisticated narrative arc, guiding the user from focused exploration into a warm, comfortable reading environment.

---

## 2. Colors & Surface Architecture

### The Palette
The core of the system is the interplay between the deep, intellectual Indigo and the grounding, organic Cream. 
- **Primary Indigo (`#3525cd` / `#4f46e5`):** Used for moments of high action and technological precision.
- **Surface Cream (`#fbf9f5`):** The primary environment. It reduces eye strain and provides a premium, "paper-like" tactile feel.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To maintain a high-end editorial feel, boundaries must be defined exclusively through background shifts.
- To separate the Header from the Hero, transition from `surface` to `surface-container-low`.
- To highlight a sidebar, use `surface-container` against the main `surface` area.
- Visual rhythm is created by the change in light, not by "boxing in" content.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
1. **Base Layer:** `surface` (The floor)
2. **Interactive Zones:** `surface-container-low` (Subtle inset)
3. **Elevated Content:** `surface-container-lowest` (The brightest "paper" layer, used for cards)
4. **Floating Intelligence:** Glassmorphism using `surface` at 70% opacity with a `24px` backdrop-blur.

### Signature Textures
Apply a subtle linear gradient from `primary` (`#3525cd`) to `primary-container` (`#4f46e5`) at a 135-degree angle for Hero sections and Primary CTAs. This creates a "glow" that suggests technological depth and prevents the Indigo from feeling flat or dated.

---

## 3. Typography: The Editorial Voice
We use **Inter** exclusively, relying on its variable weight axes to create hierarchy.

- **Display Scale (`display-lg` to `display-sm`):** Reserved for high-impact brand moments. Set with tight tracking (-0.02em) and `600` weight.
- **Headline Scale (`headline-lg` to `headline-sm`):** The "Curator's Voice." Use these for book categories and section titles. They should have ample breathing room (leading) to feel prestigious.
- **Body Scale (`body-lg` to `body-md`):** Optimized for readability. Use `on-surface-variant` (`#464555`) for long-form descriptions to soften the contrast against the cream background.
- **Label Scale:** Used for metadata (ISBN, Page Count). Set in `medium` or `semi-bold` weight to ensure authority even at small sizes.

---

## 4. Elevation & Depth: Tonal Layering

### The Layering Principle
Depth is achieved by stacking tones. A book card should not use a shadow to stand out; it should be a `surface-container-lowest` (#ffffff) shape sitting on a `surface-container` (#efeeea) background. This creates a "soft lift" that feels architectural rather than digital.

### Ambient Shadows
When an element must float (e.g., a Dark Mode toggle or a floating Search bar), use an **Ambient Shadow**:
- **Color:** A tinted version of `on-surface` (Indigo-tinted black) at 4% opacity.
- **Blur:** Large (`32px` to `64px`) with a `0px` offset.
- This mimics natural light diffusion in a high-end gallery.

### The "Ghost Border" Fallback
If accessibility requires a container definition in Dark Mode, use a **Ghost Border**: `outline-variant` at 15% opacity. Never use a solid 1px line.

---

## 5. Components

### Buttons: The Kinetic Links
- **Primary:** Gradient fill (`primary` to `primary-container`), `12px` (md) radius, `label-md` uppercase text.
- **Secondary:** Transparent with a `Ghost Border`. On hover, fill with `primary-fixed-dim` at 10% opacity.
- **Tertiary:** No container. Uses `primary` text with a subtle underline that expands on hover.

### Book Cards & Grids
- **Style:** Forbid dividers. Use `xl` (1.5rem) spacing between items.
- **Cover Visuals:** Book covers should have a `sm` (0.25rem) radius and a very subtle `outline-variant` 10% stroke to prevent "bleeding" into the cream background.
- **Info:** Book titles use `title-md`, authors use `body-sm` in `on-surface-variant`.

### Inputs & Search
- Use `surface-container-high` for the input field background.
- Radius: `md` (0.75rem).
- Active state: Transition background to `surface-container-lowest` and add a `2px` soft glow in `primary`.

### Dark Mode Support
The "Indigo to Cream" gradient inverts. In dark mode, the "Cream" becomes a deep Charcoal-Indigo (`inverse-surface`), and the primary Indigo remains the core accent. Surface nesting roles remain the same but use the dark-tier tokens.

---

## 6. Do’s and Don’ts

### Do
- **Do** use white space as a structural element. If a section feels crowded, increase the padding—don't add a line.
- **Do** use intentional asymmetry. Place a large `display-md` headline off-center to create an editorial, high-end magazine feel.
- **Do** utilize the `16px` (lg) border radius for major containers to maintain the "Welcoming" brand pillar.

### Don’t
- **Don't** use pure black (#000000) for text. Always use `on-surface` to maintain the Indigo-tinted sophistication.
- **Don't** use standard "drop shadows" with high opacity. They break the "Soft Minimalism" of the system.
- **Don't** use more than one Primary CTA per viewport. The system is "Smart and Efficient"; don't overwhelm the user.