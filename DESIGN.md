---
version: alpha
name: AIDE — Imran Aslam Personal Brand
description: Founder-led personal brand site; AIDE is the commercial arm. Deep navy + sea green liquid-glass system, trilingual EN/UR/AR.
colors:
  navy: "#0A1A3B"
  canvas: "#040B1C"
  sea: "#3DAB94"
  sea-hi: "#4FBFA7"
  cool-gray: "#E8E9EB"
  ink: "#EDF3FB"
  muted: "#A9BEDD"
  line: "#1E3A5F"
  text-on-light: "#3A4552"
  gold: "#E9C767"
  bronze: "#C9A227"
typography:
  latin:
    fontFamily: "Segoe UI, system-ui, -apple-system, Arial, sans-serif"
  urdu:
    fontFamily: "Noto Nastaliq Urdu, Jameel Noori Nastaleeq, serif"
    lineHeight: 2.1
motion:
  feedback: 100ms
  completion: 300ms
  success-tick: 470ms
  reveal-duration: 550ms
  stagger-step: 80ms
  stagger-cap: 400ms
  spring: "cubic-bezier(.34,1.56,.64,1)"
  press-scale: 0.96
---

# AIDE Design System

Tokens above are normative — they are the values live in `src/css.css` /
`src/pages.css`. This file follows Google's DESIGN.md format (google-labs-code/design.md)
so any AI agent or tool can read the system without opening the CSS.

## Colour roles

- **Navy `#0A1A3B`** — header, footer, primary surfaces. Solid, never gradient.
- **Sea green `#3DAB94`** — buttons and interactive elements only. `#4FBFA7` is a
  highlight tint, never a text colour on light grounds (contrast). Text on white
  that must read green uses a darker green (#1F7A6D or darker).
- **Cool gray `#E8E9EB`** — light section backgrounds only, always with dark gray
  (~`#3A4552`) text.
- **Gradients** — hero and primary buttons only. Nowhere else.
- Gold/bronze are sparing ceremonial accents (rules, seals), never body text.

## Glass

Liquid glass is the settled house look (owner's order, 2026-10-20): frosted,
translucent nav and cards over a subtle backdrop. Floating elements over
photography must stay transparent/liquid and in motion — never solid info
cards parked on top of the founder's photo.

## Typography

- One language per page; Urdu and Arabic are fully RTL with logical properties.
- Nastaliq line-height 2.1–2.4; never letter-space Urdu/Arabic script.
- Headlines carry the outcome; banned generic words per the master blueprint.

## Motion

Per the Motion Mastery Pack (2026-11-04): feedback 100ms, completion ~300ms,
success tick ~470ms, sibling reveals staggered 80ms (cap 400ms), spring easing
on press/hover, `prefers-reduced-motion` always honoured. Never animate prices,
credentials, testimonials or form errors. Frequency gate: oft-used controls get
no decorative motion.

## Imagery

- Real photography first; generated images are illustrative only, never
  presented as records of real events.
- No women in AIDE website brand visuals (owner's order, 2026-11-01).
- Every visual depicts its own page's subject — no generic scenic stock.
- Text over imagery is checked zone by zone for readability; deepen a local
  scrim under failing text, never redesign the layout to fix contrast.

## Governing standard

Premium in every dimension — the floor is not the target. Build targets:
LCP ≤1.2s / INP ≤80ms / CLS ≤0.02 on a mid-range Android over 4G in Pakistan.
Full standard: `~/workspace/your_files/aide-website-master-blueprint-2026-11-04.md`.
