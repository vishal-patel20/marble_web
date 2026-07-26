---
name: MarbleCraft
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#755b00'
  on-secondary: '#ffffff'
  secondary-container: '#fed255'
  on-secondary-container: '#735a00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffe08e'
  secondary-fixed-dim: '#ecc246'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 20px
  section-gap: 160px
---

## Brand & Style

The design system is engineered to evoke the timeless permanence of natural stone through a lens of high-end editorial luxury. It targets a discerning audience of architects, interior designers, and premium homeowners who value heritage craftsmanship and modern precision.

The visual direction is a fusion of **Minimalism** and **Glassmorphism**. It prioritizes vast negative space to allow high-resolution photography of stone textures to serve as the primary visual driver. The interface feels weightless yet structured, utilizing translucent layers to suggest the depth and clarity of polished quartz or marble. The emotional response is one of quiet confidence, architectural rigor, and uncompromising quality, mirroring the brand's positioning alongside global luxury icons.

## Colors

The palette is rooted in the natural tones of a stone quarry, elevated by precious metal accents. 

- **Primary (Charcoal Black):** Used for authoritative typography and structural elements to provide a grounded, high-contrast foundation.
- **Secondary (Gold Accent):** Applied sparingly for interactive highlights, CTAs, and premium indicators to signify luxury and craft.
- **Tertiary (Marble Gray):** Employed for subtle backgrounds and dividers, mimicking the soft veins of Carrara marble.
- **Neutral (Deep Slate):** Used for secondary text and functional UI elements to maintain legibility without the harshness of pure black.
- **Background (Pure White):** The primary canvas, ensuring the "Editorial" feel and maximum clarity for product showcases.

## Typography

This design system utilizes **Inter** exclusively to achieve a systematic, architectural clarity. The type scale is dramatic, featuring large display headings with tight tracking to mimic luxury print journals. 

- **Display & Headlines:** Use tight letter-spacing and medium weights to create a sense of refined power.
- **Body Text:** Ample line-height (1.6) is mandatory to ensure breathability and an effortless reading experience.
- **Label Caps:** Small, uppercase labels with wide letter-spacing are used for categories and overlines to provide a technical, "blueprinted" aesthetic.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop, centered within a generous 1440px container. 

- **The 12-Column Grid:** Content is aligned to a 12-column structure with 32px gutters. Large immersive imagery often breaks the grid to span the full viewport width (Bleed).
- **Vertical Rhythm:** A massive `section-gap` of 160px is used between major content blocks to enforce the minimalist, "gallery-like" pace of the site.
- **Mobile Reflow:** On mobile, the 12 columns collapse to 4, and margins shrink to 20px. Display typography must scale down significantly to maintain legibility.

## Elevation & Depth

Depth is articulated through **Glassmorphism** and soft, environmental shadows. 

- **Surface Treatment:** Elevated panels (like navigation bars or product overlays) use a `20px` backdrop blur with a `15%` opacity white fill. A thin `1px` stroke in `Marble Gray` at `30%` opacity defines the boundary.
- **Shadows:** Use a "Large & Soft" approach. Shadows should have a 40px–60px blur radius with a very low `5%` opacity Charcoal Black tint. This creates a floating effect rather than a heavy, physical drop.
- **Transitions:** All depth changes (hovering over a card) must use a slow, eased transition (400ms) to maintain the premium, "deliberate" feel of the interface.

## Shapes

The shape language is "Soft-Modern." While the overall layout is architectural and rectilinear, individual interactive elements utilize a `0.5rem` (8px) to `1rem` (16px) corner radius.

- **Standard Elements:** Buttons and input fields use an 8px radius.
- **Cards & Containers:** Large content containers and product cards use a 16px radius to feel approachable and sophisticated.
- **Selection Indicators:** Small chips or tags may use a pill-shape (full radius) to contrast against the structural grid.

## Components

- **Primary Button:** Solid Charcoal Black (#111111) with white typography. On hover, the button transitions to Gold (#C9A227). The interaction should be fluid and steady.
- **Ghost Button:** A 1px Charcoal Black border with no fill. Used for secondary actions to maintain the minimalist aesthetic.
- **Glass Cards:** Used for stone sample previews. Feature a high-resolution image background with a bottom-aligned glassmorphic label containing the stone name and origin.
- **Input Fields:** Bottom-border only (1px Deep Slate) with no background fill. When focused, the border transitions to Gold.
- **Stone Filter Chips:** Small, pill-shaped elements with a Marble Gray (#E8E8E8) background. Active state is Charcoal Black with White text.
- **Gallery Viewer:** A full-screen immersive component with minimal UI controls, emphasizing the scale and texture of the marble slabs.