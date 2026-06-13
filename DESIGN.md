---
name: Website Auditor
description: Instant website health checks in plain English, for non-technical business owners
colors:
  coral: "#e2603f"
  coral-deep: "#b9461f"
  coral-tint: "#fbe9e3"
  coral-tint-mid: "#efb7a3"
  ink: "#1c1a17"
  ink-secondary: "#3c3a35"
  muted: "#908d86"
  line: "#ece9e3"
  line-subtle: "#f1efe9"
  surface-bg: "#e9e6e0"
  surface-panel: "#f4f2ee"
  surface-card: "#ffffff"
  surface-card-alt: "#faf8f5"
  semantic-green: "#4f8f57"
  semantic-green-dark: "#2f5e35"
  semantic-green-soft: "#e6f0e4"
  semantic-amber: "#d99033"
  semantic-amber-dark: "#8a5a0e"
  semantic-amber-soft: "#f7ecda"
  semantic-red: "#d0533f"
  semantic-red-dark: "#a83228"
  semantic-red-soft: "#f7e3dd"
typography:
  display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(38px, 5.2vw, 62px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(30px, 3.4vw, 42px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  eyebrow:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.14em"
rounded:
  xl: "30px"
  lg: "22px"
  md: "16px"
  sm: "11px"
  pill: "999px"
spacing:
  sm: "10px"
  md: "18px"
  lg: "24px"
  xl: "34px"
components:
  button-coral:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.surface-card}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-coral-hover:
    backgroundColor: "{colors.coral-deep}"
    textColor: "{colors.surface-card}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-black:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-card}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-ghost:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  chip-coral:
    backgroundColor: "{colors.coral-tint}"
    textColor: "{colors.coral-deep}"
    rounded: "{rounded.pill}"
    padding: "6px 11px"
  chip-green:
    backgroundColor: "{colors.semantic-green-soft}"
    textColor: "{colors.semantic-green-dark}"
    rounded: "{rounded.pill}"
    padding: "6px 11px"
  chip-amber:
    backgroundColor: "{colors.semantic-amber-soft}"
    textColor: "{colors.semantic-amber-dark}"
    rounded: "{rounded.pill}"
    padding: "6px 11px"
  chip-red:
    backgroundColor: "{colors.semantic-red-soft}"
    textColor: "{colors.semantic-red-dark}"
    rounded: "{rounded.pill}"
    padding: "6px 11px"
  chip-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-card}"
    rounded: "{rounded.pill}"
    padding: "6px 11px"
  card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: "22px"
  panel:
    backgroundColor: "{colors.surface-panel}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface-card-alt}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
---

# Design System: Website Auditor

## 1. Overview

**Creative North Star: "The Honest Mechanic"**

A mechanic doesn't show you a glossy report — they show you the part that's failing and hand you a numbered to-do list. Website Auditor is built on that same principle: the result is the product. There's no decoration between the user and the verdict, no jargon barrier, no upsell choreography. Every pixel serves the diagnosis.

The interface earns trust the way expertise earns trust — through clarity, speed, and the confident absence of fuss. The dark header band states the result before the user has scrolled a pixel. The fix list speaks to a non-technical business owner the way a good tradespeople's quote does: ranked by what matters most, written in language anyone can act on. Signal Coral is the wrench icon of the palette — it appears only where action is required.

This system deliberately rejects the three failure modes of the category: the cold SaaS dashboard that treats every small business owner like an enterprise IT manager; the generic AI tool aesthetic of cream backgrounds and glassmorphism that signals "built by algorithm, not by someone who thought about your problem"; and the bouncy startup playfulness that reads as unserious to someone who needs honest advice about their livelihood.

**Key Characteristics:**
- Neutral-gray background that makes Signal Coral the only warm element on screen
- Black header band that delivers the verdict before any copy is read
- Pill-shaped buttons and chips — rounded without being soft
- Semantic color palette (green/amber/red) for pass/warn/fail states — always paired with icons, never color-only
- Two-font system: Hanken Grotesk for all UI text; JetBrains Mono strictly for code, metadata labels, and URL display

## 2. Colors: The Workshop Palette

One warm accent. Everything else works for a living.

### Primary

- **Signal Coral** (`#e2603f` / `--coral`): The only warm element in the system. Used on primary action buttons, the "high impact" chip, score band progress fills, and the hero-level CTA. Appears only where the user needs to act or pay attention. Its scarcity is the point.
- **Signal Coral Deep** (`#b9461f` / `--coral-700`): Hover state and darker text-on-light usage (chip labels, interactive link color). Never used as a background at full saturation in body areas.
- **Coral Tint** (`#fbe9e3` / `--coral-tint-1`): The soft background for coral chips and the first high-priority fix card. Signals importance without the urgency of full coral.

### Neutral

- **Workshop Black** (`#1c1a17` / `--ink`): Primary heading text, the results page header band background, the black button variant. The darkest surface in the system — reserved for the most important surfaces and text.
- **Charcoal** (`#3c3a35` / `--ink-2`): Secondary text, button labels at rest, subheadings and supporting body copy.
- **Worn Gray** (`#908d86` / `--muted`): Muted supporting text, timestamps, placeholder context. Must not be used for body copy that carries meaning; it is for annotation only.
- **Concrete** (`#e9e6e0` / `--bg`): The page background mat. Neutral — no warm or cool tint. Cards and panels float above it.
- **White Wall** (`#f4f2ee` / `--panel`): Section panel background, slightly lighter than Concrete. Used for services and examples sections to create structural rhythm without borders.
- **Bare White** (`#ffffff` / `--card`): Card and component background. The lightest surface.
- **Paper** (`#faf8f5` / `--card-2`): Alternate card background and input background. One step warmer than Bare White to create subtle inset depth.

### Semantic

- **Pass Green** (`#4f8f57` / `--green`): Score progress fills and status dots. Paired with Soft Green background for chips and icons.
- **Pass Green Text** (`#2f5e35` / `--green-dark`): Text and icon color on Pass Green Soft — hits WCAG AA at 12px.
- **Pass Green Soft** (`#e6f0e4` / `--green-soft`): Chip and icon container background for passing states.
- **Warning Amber** (`#d99033` / `--amber`): Score progress fills for borderline states. Paired with Soft Amber.
- **Warning Amber Text** (`#8a5a0e` / `--amber-dark`): Text on Soft Amber backgrounds — WCAG AA compliant.
- **Warning Amber Soft** (`#f7ecda` / `--amber-soft`): Chip and icon container background for warning states.
- **Fail Red** (`#d0533f` / `--red`): Score fills and error indicators. Paired with Soft Red.
- **Fail Red Text** (`#a83228` / `--red-dark`): Text on Soft Red backgrounds — WCAG AA compliant.
- **Fail Red Soft** (`#f7e3dd` / `--red-soft`): Chip and icon container background for fail states.

**The One Warm Rule.** Signal Coral is the only warm-hued element in the interface. Every other color is neutral (gray-anchored) or semantic (pass/warn/fail). A second warm accent — orange, yellow, gold — would break this system. If you add color, it must be neutral or explicitly semantic.

**The Semantic Pairing Rule.** Pass/warn/fail states are never conveyed by color alone. Every semantic chip, icon, and score strip pairs the color with an icon (`✓` / `!` / `✗`) or a text label. Users who are color-blind or viewing in low contrast must read the same verdict.

## 3. Typography

**Primary Font:** Hanken Grotesk (400, 500, 600, 700, 800) — loaded from Google Fonts with `display=swap`
**Mono Font:** JetBrains Mono (400, 600, 700) — for code blocks, URL display, and eyebrow/metadata labels only

**Character:** A single geometric sans-serif at high weight contrast carries the entire hierarchy. The 800-weight headlines are the audit verdict — unambiguous and fast to read. The mono accent is the technical layer: URLs, dates, code snippets. It signals "this is data" without cluttering the reading flow.

### Hierarchy

- **Display** (800, `clamp(38px, 5.2vw, 62px)`, leading 1.02, tracking -0.035em): Hero headings, the page-level audit verdict. One per view. `text-wrap: balance` always.
- **Headline** (800, `clamp(30px, 3.4vw, 42px)`, leading 1.1, tracking -0.03em): Section headings, CTA headings. `text-wrap: balance` always.
- **Title** (800, 22px, leading 1.2, tracking -0.02em): Card headings, subsection titles, the audit tool name in headers.
- **Body** (400–500, 14.5–17px, leading 1.5, tracking -0.01em): All descriptive copy, recommendation bodies, service descriptions. Max 520px (approximately 65ch) wide.
- **Label** (700, 13–15px, tracking -0.01em): Button text, chip labels, form field labels, navigation items. Not for body copy.
- **Eyebrow** (Mono, 600, 11px, tracking 0.14em, all-caps): Used sparingly for metadata context — "In plain English", "Audit · [date]". Not for section headings.

**The One-Family Rule.** Hanken Grotesk carries every role from display through label. JetBrains Mono is strictly restricted to: URLs, code blocks, the `wa-eyebrow` class (metadata only), and the `wa-mono` utility class. Introducing a third family is prohibited.

**The Weight Contrast Rule.** Every heading is 800. Every label is 700. Body copy is 400. This three-step weight contrast is the hierarchy. Do not use 600 for headings or 500 for labels — the contrast collapses.

## 4. Elevation

This system uses structural shadows: depth communicates containment, not decoration. Shadows appear on surfaces that hold interactive content (cards) or float above the page mat (modal-type elements). Flat sections don't shadow.

### Shadow Vocabulary

- **Ambient** (`--shadow-sm: 0 1px 2px rgba(40,32,24,.04), 0 2px 6px rgba(40,32,24,.04)`): Default card shadow. Separates cards from the Concrete background without calling attention to the shadow itself. Every `.wa-card` uses this.
- **Raised** (`--shadow-md: 0 2px 6px rgba(40,32,24,.05), 0 14px 34px rgba(40,32,24,.07)`): Modals, floating action cards, popover-type elements. One step heavier — used when a surface is logically above another.
- **Lifted** (`--shadow-lg: 0 4px 10px rgba(40,32,24,.06), 0 30px 70px rgba(40,32,24,.10)`): The floating micro-card on the hero visual, and any surface that needs strong separation. Rarely used; never on adjacent cards.

**The Flat Panel Rule.** Panel surfaces (`.wa-panel`, section backgrounds) use background-color only — no shadows. Shadows are for cards within panels, not the panels themselves.

**The No-Decorative-Shadow Rule.** Shadows on static non-interactive surfaces are prohibited. If something doesn't respond to hover or focus, it doesn't shadow.

## 5. Components

### Buttons

Direct and confident — pill radius, heavy weight, minimum 44px touch target. No secondary hover animations beyond opacity; the form IS the feedback.

- **Shape:** Fully pill (`border-radius: 999px`). All button variants share this shape.
- **Coral Primary** (`--coral` bg, white text, 14px 24px padding): The one action that matters per screen. Carries a warm box-shadow (`color-mix(in srgb, var(--coral) 30%, transparent)`) to separate it from the background.
- **Black Primary** (`--ink` bg, white text): Used on dark surfaces where coral would compete, and as the secondary CTA adjacent to coral.
- **Ghost** (white bg, `--ink` text, `1px solid var(--line)` border): For de-emphasized or supporting actions. Never in competition with a coral button.
- **Hover:** `opacity: 0.88` — universal across all variants. One rule, never broken.
- **Disabled:** `opacity: 0.55` — same rule, same class.
- **Sm variant:** `padding: 10px 18px; font-size: 13.5px` — used in headers and compact areas. Still 44px min-height.

### Chips

Pill-shaped status labels. Never interactive decoration — every chip communicates something the user needs to know.

- **Style:** `border-radius: 999px`, 12px font, 700 weight, 6px 11px padding
- **Coral:** coral-tint bg, coral-deep text — for category labels ("For local business owners") and the signal-urgency "Needs work" state
- **Green / Amber / Red:** Semantic trios — soft background + dark text for guaranteed AA contrast at 12px. Never use `--green`, `--amber`, or `--red` directly as text on their soft backgrounds; always use the `--*-dark` token.
- **Dark:** ink bg, white text — for locked/gated state labels ("Locked")
- **Blue:** `#e4e0f8` bg, `#5b4fcf` text — for the AI/plan-related classification chips in the improvement plan

### Cards / Containers

The primary content surface. Cards are white islands in the Concrete background.

- **Card:** White (`--card`), 22px radius (`--r-lg`), Ambient shadow (`--shadow-sm`), 22px internal padding. Always the `.wa-card` class.
- **Panel:** Panel background (`--panel`), 30px radius (`--r-xl`), no shadow — used for full-width section backgrounds and the score/results header band container.
- **Dark Card:** Ink background (`--ink`), white text — used for the audit results header band and the "In plain English" AI summary block. The dark surface is the verdict surface; it appears once per results view as the dominant element.
- **Internal Padding:** Cards use 22–26px padding at all breakpoints. Nested elements within cards use border-top (`1px solid var(--line-2)`) for dividers — never `margin-bottom` alone.

### Inputs / Fields

- **Style:** Paper background (`--card-2`), `1px solid var(--line)` border, 11px radius (`--r-sm`), 10px 14px padding
- **Focus:** `border-color: var(--coral)` — the only interactive focus indicator. No glow, no outline addition.
- **Placeholder:** `--muted-2` color (`#b6b2a9`) — always set; never rely on browser default gray.
- **Error:** Not yet formally designed. Use `--red` border on the field + `--red` small text below. Do not use red background on the field.

### Icons (Pass / Warn / Fail)

- **Shape:** 26px circle, 8px font, 800 weight, center-aligned
- **Pass:** `--green-soft` bg, `--green-dark` text, `✓` glyph
- **Warn:** `--amber-soft` bg, `--amber-dark` (for text contrast) text, `!` glyph
- **Fail:** `--red-soft` bg, `--red-dark` text, `✗` glyph
- Always paired with a text label — icon alone is not sufficient.

### Signature Component: Score Band

The dark header band on the results page is the defining pattern of this design system. A full-width ink-colored pill container shows the business name at display scale alongside three score boxes — each showing a `/100` number with a semantic progress bar below it. This is "The Honest Mechanic" made literal: you walk into the garage and the mechanic points to the three things they measured before you say a word.

The score boxes use `background: rgba(255,255,255,.06)` and `border: 1px solid rgba(255,255,255,.1)` — subtle separation on the dark surface. The score value is 44px, weight 800, tracking -0.04em. The progress bars use the semantic color (green/amber/red) against a `rgba(255,255,255,.14)` track.

This pattern appears on the results page header only. It must not be repurposed for marketing sections, loading screens, or dashboard widgets.

### WADonut (Score Donut)

A conic-gradient donut chart for individual score display. Uses CSS `background: conic-gradient(...)` with a centered cutout via a pseudo-element (`inset: 12%`, white circle). Score label centered via `z-index: 1`. Used in the improvement plan sidebar. The cutout circle background matches the card surface, not a hardcoded white — critical for dark surfaces.

## 6. Do's and Don'ts

### Do:

- **Do** use Signal Coral (`#e2603f`) only on primary actions, the high-priority chip, and score progress fills. One warm element per screen. If a second element wants to be coral, make it black instead.
- **Do** pair every semantic color (green, amber, red) with an icon or text label. Never rely on color alone to convey pass/warn/fail.
- **Do** use `--muted` text only for annotations, timestamps, and supporting context — never for body copy that carries meaning. If a user needs to read it to make a decision, use `--ink-2` at minimum.
- **Do** maintain the 800 → 700 → 400 weight structure for display → label → body. Weight contrast is the hierarchy.
- **Do** let the dark Score Band be the results page's dominant visual element. Everything else on that page should be quieter.
- **Do** use `text-wrap: balance` on all display and headline elements to prevent orphaned words on narrow viewports.
- **Do** use JetBrains Mono (`--mono`) strictly for URLs, code blocks, dates, and the `wa-eyebrow` class. Never use mono for headings, body copy, or button labels.

### Don't:

- **Don't** use cream, sand, beige, or warm-tinted backgrounds for the page background. `--bg` is neutral gray. Reverting to a warm-neutral background is the generic AI tool aesthetic — the exact anti-reference in PRODUCT.md.
- **Don't** use glassmorphism (`backdrop-filter: blur` + semi-transparent surfaces) decoratively. The lock overlay uses it for a specific purpose; everywhere else it is prohibited.
- **Don't** add `border-left` greater than 1px as a colored accent stripe on cards, callouts, or list items. Rewrite the element with a background tint, a leading number, or a semantic icon.
- **Don't** use `background-clip: text` with a gradient — prohibited in all cases. Solid color only.
- **Don't** place a small mono uppercase eyebrow (`wa-eyebrow`) above every section heading. It signals AI-generated scaffolding. Reserve the eyebrow class for metadata display (dates, technical labels) — not for section navigation.
- **Don't** make the design feel cold or enterprise. No dark navy, no dense data tables styled like internal tooling, no Notion-style monochrome. This tool is for a café owner checking their site between orders.
- **Don't** make the design feel playful or startup-cute. No pastel gradients, no bounce animations, no illustrations. The brand personality is "sharp, fast, direct" — PRODUCT.md's exact words.
- **Don't** use the Score Band pattern outside the results page header. It is the signature diagnostic moment, not a reusable widget.
- **Don't** hard-code hex values for colors that have CSS custom properties. Every color must reference a `var(--token)`. New colors that don't have a token should either use an existing token or get one — not an inline hex.
