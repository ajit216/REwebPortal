# Design System — REwebPortal

---

## 1. Design Philosophy

**Trustworthy, not alarming. Informative, not overwhelming.**

This is a platform that deals with serious financial concerns. The design must:
- Convey **credibility** — buyers need to trust the data
- Use **severity-appropriate visual language** — red flags are serious, green is genuinely good
- **Surface complexity progressively** — overview first, detail on demand
- Be **accessible** — WCAG 2.1 AA minimum across all components

---

## 2. Brand Identity

### Platform Name
**REwebPortal** — working name. Consider a consumer-brand name for launch (e.g., "FlatFact", "HouseCheck", "ReraWatch").

### Tone
- Factual, not sensational
- Empowering, not doom-and-gloom
- Professional, not corporate-cold
- Clear, not jargon-heavy

---

## 3. Color Palette

### Primary Colors
```
Primary Blue (Trust, Action)
  --color-primary-50:  #EFF6FF
  --color-primary-100: #DBEAFE
  --color-primary-500: #3B82F6    ← Main brand color
  --color-primary-600: #2563EB    ← Hover state
  --color-primary-700: #1D4ED8    ← Active state
  --color-primary-900: #1E3A8A

Neutral (Content, Backgrounds)
  --color-neutral-50:  #F8FAFC
  --color-neutral-100: #F1F5F9
  --color-neutral-200: #E2E8F0
  --color-neutral-400: #94A3B8
  --color-neutral-600: #475569
  --color-neutral-800: #1E293B
  --color-neutral-900: #0F172A    ← Primary text
```

### Semantic Colors (Status System)
```
Success / Good (RERA valid, On-time, Grade A)
  --color-success-50:  #F0FDF4
  --color-success-500: #22C55E
  --color-success-700: #15803D

Warning / Caution (Extension, Nearing deadline, Grade C)
  --color-warning-50:  #FEFCE8
  --color-warning-500: #EAB308
  --color-warning-700: #A16207

Danger / Critical (RERA lapsed, Stalled, Grade D)
  --color-danger-50:   #FFF1F2
  --color-danger-500:  #EF4444
  --color-danger-700:  #B91C1C

Info / Neutral status (Under Construction, Pending)
  --color-info-50:     #F0F9FF
  --color-info-500:    #0EA5E9
  --color-info-700:    #0369A1
```

### Transparency Score Grade Colors
```
A+ / A  →  --color-success-500   #22C55E  (Green)
B       →  --color-info-500      #0EA5E9  (Blue)  
C       →  --color-warning-500   #EAB308  (Amber)
D       →  --color-danger-500    #EF4444  (Red)
```

---

## 4. Typography

```
Font Stack:
  Headings: "Plus Jakarta Sans", sans-serif  (Google Fonts — modern, professional)
  Body:     "Inter", sans-serif               (High legibility at small sizes)
  Mono:     "JetBrains Mono", monospace       (RERA numbers, codes)

Scale (Tailwind compatible):
  text-xs:   12px / 16px line-height
  text-sm:   14px / 20px
  text-base: 16px / 24px     ← Body default
  text-lg:   18px / 28px
  text-xl:   20px / 28px
  text-2xl:  24px / 32px
  text-3xl:  30px / 36px
  text-4xl:  36px / 40px

Font Weights:
  Regular: 400   ← Body text
  Medium:  500   ← Labels, UI text
  SemiBold: 600  ← Subheadings, CTAs
  Bold:    700   ← Headings, scores
```

---

## 5. Spacing System

Tailwind default 4px base unit:
```
1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 6 = 24px,
8 = 32px, 10 = 40px, 12 = 48px, 16 = 64px, 20 = 80px
```

**Component spacing guidelines:**
- Card internal padding: `p-6` (24px)
- Section vertical gap: `gap-8` (32px) between sections
- Form field gap: `gap-4` (16px)
- Button internal padding: `px-4 py-2` (small) / `px-6 py-3` (default) / `px-8 py-4` (large)

---

## 6. Grid & Layout

```
Container max-width: 1280px (max-w-7xl)
Content max-width:   768px (max-w-2xl) for article content

Grid system:
  Mobile:  1 column
  Tablet:  2 columns (md: breakpoint, ≥768px)
  Desktop: 3-4 columns (lg: breakpoint, ≥1024px)

Page Layout:
  ┌─ Topbar (64px) ─────────────────────────────────────────┐
  ├─ (Optional) Alert Banner (48px) ──────────────────────── │
  ├─ Main Content Area ─────────────────────────────────────  │
  │   ┌─ Sidebar (280px, sticky) ─┐ ┌─ Content (flex-1) ─┐  │
  │   │                           │ │                     │  │
  │   └───────────────────────────┘ └─────────────────────┘  │
  └─ Footer (variable) ────────────────────────────────────── │
```

---

## 7. Iconography

**Icon set:** Lucide React (consistent with shadcn/ui)

**Key icons and their usage:**
```
Shield           → Verified buyer, RERA compliance
AlertTriangle    → Warning, red flag
AlertCircle      → Critical alert
CheckCircle      → Approved, resolved, on-time
XCircle          → Failed, lapsed, critical
Clock            → Delay, pending, waiting
TrendingDown     → Score declining, delays increasing
TrendingUp       → Score improving
Building         → Builder, project
MapPin           → Location
FileText         → Legal document, RERA filing
Users            → Community, co-buyers
MessageSquare    → Forum, discussion
Flag             → Report, grievance
Star             → Transparency score
```

---

## 8. Status Badge System

A consistent set of badges used across all project and builder listings:

```tsx
// Project Status Badges
<Badge variant="success">On Time</Badge>          // green
<Badge variant="success">Ready to Move</Badge>    // green
<Badge variant="info">Under Construction</Badge>  // blue
<Badge variant="warning">Nearing Completion</Badge> // amber (>85%)
<Badge variant="warning">Extended</Badge>         // amber
<Badge variant="danger">Delayed</Badge>           // red
<Badge variant="danger">Stalled</Badge>           // red (dark)

// RERA Badges
<Badge variant="success">RERA Active</Badge>      // green
<Badge variant="warning">RERA Extended</Badge>    // amber
<Badge variant="danger">RERA Lapsed</Badge>       // red

// Buyer Verification Badge
<Badge variant="verified">✓ Verified Buyer</Badge> // green with shield icon
```

---

## 9. Score Visualization Components

### 9.1 Transparency Score Circle
```
Large circular gauge (0–100) with:
- Animated fill on load
- Color changes based on range (green/blue/amber/red)
- Grade letter in center
- "Transparency Score" label below
Used on: Project detail header, Builder detail header
```

### 9.2 Score Bar (Component)
```
[Label              ] [███████████░░░░░░░░░] 72/100
Used in: Builder scorecard breakdown
```

### 9.3 Risk-O-Meter
```
[====●=========]
 Low   Med   High   Critical
Used in: Buyer's Due Diligence tool
```

---

## 10. Accessibility Standards

- **Color contrast:** Minimum 4.5:1 for body text, 3:1 for large text (WCAG AA)
- **Focus states:** Visible ring on all interactive elements (ring-2 ring-primary-500)
- **ARIA labels:** All icon-only buttons must have `aria-label`
- **Keyboard navigation:** Full tab order on all forms and navigation
- **Screen reader:** Use semantic HTML (nav, main, section, article, aside)
- **Alt text:** Required on all images with meaningful content
- **Error messages:** Must be associated with form fields via `aria-describedby`
- **Color not sole indicator:** Status always shown with icon + text + color (never color alone)
- **Touch targets:** Minimum 44×44px for all interactive elements
- **Language:** Set `lang="en"` on `<html>` (add regional lang for Hindi-language features later)

---

## 11. Dark Mode

Not required for v1. Design system tokens are structured to support dark mode addition in v2:
```css
/* When dark mode added, override via class strategy */
.dark {
  --color-neutral-900: #F8FAFC;  /* text flips */
  --color-neutral-50: #0F172A;   /* backgrounds flip */
}
```
