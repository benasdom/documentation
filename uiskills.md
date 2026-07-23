---
name: ue-docs-ui
description: Design system for a dark/light dual-theme "docs dashboard" UI — collapsible icon+label sidebar, tabbed brand switcher, dot-grid hero card with a fade-in-up content transition, a multi-speed image marquee, anchored dropdown menus, a centered command-palette modal, and a toast stack. Use this skill any time the user asks to build, extend, restyle, or add a new page/section/component to "the docs UI", "the UE docs dashboard", or explicitly references this design system — even if they don't repeat the full spec. Also use it as a strong reference whenever someone asks for a dark-mode dashboard, admin panel, or documentation site and hasn't specified a different visual direction. Covers visual design and interaction mechanics only (colors, type, layout, motion, component anatomy) — not business logic or data.
---

# UE Docs UI System

A dark/light dashboard design system originally built to recreate a documentation
product's UI from screenshots. Use this to keep new screens, components, or pages
visually and behaviorally consistent with that system — same tokens, same layout
skeleton, same motion language — without needing the original screenshots again.

**Scope reminder:** this skill governs *look and interaction mechanics only* —
colors, type, spacing, layout, component anatomy, animation timing/easing, and
show/hide/open/close flows. It intentionally does not prescribe business logic
(what search results to show, what a "sign out" button does, what real data
populates a bookmark list). Wire that up per the actual task.

## Before building anything

1. Read `assets/theme-tokens.css` and `assets/components.css` — copy them in
   wholesale (or the relevant sections) rather than reinventing equivalent CSS.
   They contain every color, radius, shadow, and keyframe this system uses, for
   both themes.
2. Read `assets/components.html` for markup patterns (dropdown anchor structure,
   modal structure, nav-item structure, tile structure, etc.) — reuse the DOM
   shape so the CSS above applies without modification.
3. Only deviate from the tokens/patterns if the user explicitly asks for a
   different visual direction for the new piece. Default to matching.

## Design tokens (summary — full values in assets/theme-tokens.css)

**Dark theme** (default): near-black background (`#0a0b0f`), card surfaces one
or two steps lighter (`#111319` / `#15171f` / `#1a1c24`), hairline borders
(`#23262f`), primary text near-white (`#f2f3f5`), muted text (`#8a8e99`), faint
text/placeholders (`#5b5f6a`).

**Light theme**: soft gray background (`#f4f5f7`), white surfaces, borders
around `#e3e5ea`, primary text near-black (`#14161b`), muted (`#6b7078`), faint
(`#9498a1`).

Both themes share the same **accent palette** (do not reskin these per theme):
cyan `#35c7e8` (primary/active accent, focus rings), blue `#3b7cf6`, pink
`#ef3fa6` (these two are used together in gradients for avatars/brand marks),
danger red `#ef4444`.

Radii: `18px` large surfaces (hero card, modals), `12px` medium (dropdowns,
tiles, search bar), `8px` small (buttons, nav items, list rows). Shadows only
render in light theme in a visible way — dark theme relies more on borders;
both are defined via a single `--shadow` token so components don't need
theme-conditional CSS.

Toggling theme = swapping the `data-theme` attribute on `<html>` between
`"dark"` and `"light"`. Every color in the system is a CSS variable scoped to
that attribute — never hardcode a hex color into a new component; add it to
the token file's dark/light blocks instead so it participates in theme
switching.

## Typography

Font: **Inter** (Google Fonts), weights 400/500/600/700/800. No secondary
display face — this system carries personality through scale and weight, not
font pairing.

- Hero/section title (the big fading-in headline): 46px / weight 700 /
  line-height 1.05 / letter-spacing -0.02em. Unfilled state uses
  `--text-faint`; filled state uses `--text`.
- Body / UI text: 13.5–15px / weight 500 for interactive labels, 400 for
  passive text.
- Eyebrow / section labels (e.g. "Other options", "Sections" in the command
  palette): 11px, uppercase, letter-spacing 0.06em, `--text-faint`.
- Never introduce a serif or a second display font into this system.

## Layout skeleton

```
┌─────────────────────────────────────────────────────────┐
│ topbar: breadcrumb …………………… search  icon icons  theme  avatar │
├─────────────────────────────────────────────────────────┤
│ brand tabs row: [● brand] [brand] [brand] ············ ⋯│
├────────┬────────────────────────────────────────────────┤
│sidebar │  hero-card (dot-grid bg)                        │
│(collap-│  ┌──────────────────────┬───────────────────┐   │
│ sible) │  │ awaiting tag         │  marquee (3 rows,  │   │
│        │  │ welcome text + ◇     │  different speeds  │   │
│        │  │                      │  & directions)     │   │
│        │  │ [big fading title]   │                    │   │
│        │  └──────────────────────┴───────────────────┘   │
│        │  meta-bar: Category | Content                    │
│        │                                                  │
├────────┴────────────────────────────────────────────────┤
│ footer: centered, small, muted                            │
└─────────────────────────────────────────────────────────┘
```

CSS grid areas: `topbar`, `brands`, `sidebar`, `main`, `footer` — sidebar spans
both the main and footer rows (`grid-template-areas` in the token file shows
the exact wiring). Reuse this skeleton for new top-level pages; add new
*sections* inside `main` rather than inventing a new page chrome.

## Component anatomy

**Top bar** — breadcrumb (`Dashboard › Section ›`) on the left; on the right, in
order: search trigger (looks like an input, opens a modal — never a live
inline input), icon buttons (36–38px square, 10px radius, bordered, optional
notification dot top-right), a dedicated theme toggle icon button, then a
circular gradient avatar. Icon buttons and the avatar get a highlighted
border/outline when their dropdown is open (`.open` class).

**Brand tabs row** — horizontal list of brand/workspace buttons, each with a
small (26px) rounded gradient mark + label. Active tab gets a 2px cyan
underline and full-brightness text; inactive tabs are muted. A trailing "···"
button opens a dropdown for workspace management. This row is a tab set, not
a nav — only one can be active.

**Sidebar** — fixed 240px expanded / 72px collapsed, animated width transition
(`0.28s cubic-bezier(.4,0,.2,1)`). A circular toggle button sits on the
sidebar's right edge, its chevron rotating 180° on collapse. Nav items are
full-width rows: icon + label, label fades/hides when collapsed. Group items
under an uppercase faint label ("Other options") when there's a primary
item (e.g. Dashboard) plus a secondary group — don't flatten everything into
one list once there are 4+ items. Active item: bordered pill with
`--active-bg` fill. Hover: transparent → `--hover-bg`, no border.

**Hero card** — the signature surface. Dark/light-aware dot-grid background
(two 1px line gradients at 28px spacing) plus a soft radial cyan glow at the
top-left, all inside a bordered, large-radius container. Left half holds a
small pill tag, a "welcome"-style eyebrow with a diamond glyph, and the big
title that fades in on change (see Motion below). Right half holds the
marquee. Below the card, a thin `meta-bar` with evenly divided labeled cells,
visually continuous with the card (negative margin to merge borders).

**Marquee** — 2–3 horizontal rows of fixed-size rounded tiles (108×132px),
each row looping at a *different* duration (roughly 20–45s range) and
alternating scroll direction row-to-row. Build the seamless loop by rendering
each row's sequence twice back-to-back and animating `translateX(0 → -50%)`
(or the reverse for right-to-left rows). Mask the container's top/bottom
edges with a `linear-gradient` alpha mask so tiles fade in/out at the
boundary instead of clipping hard. Tile variants: solid gradient brand color
tiles (cyan/blue/pink) with a small glyph + label, and neutral "dark" tiles
using panel colors for filler/rhythm.

**Dropdown menu** — anchored (`position: absolute`) under its trigger,
280px default width (narrower, ~220px, for simple menus), opens with a
combined opacity + `translateY(-6px)→0` + `scale(0.98)→1` transition at
`0.14s`. Only one dropdown open at a time; outside-click and `Escape` close
all. Rows are full-width buttons: icon + label, optional trailing hint text
or a small remove/× control. Optional header block (name/email or menu
title) separated by a hairline divider. A "theme row" pattern (two segmented
buttons, Light/Dark, active one gets a raised background) is the standard way
to expose theme choice *inside* a menu, in addition to the dedicated top bar
toggle.

**Command palette / modal** — centered near the top of the viewport (not
vertically centered), backdrop uses the `--overlay` token, panel slides
`translateY(-10px)→0` on open at `0.15s`. Structure: icon + input row with a
trailing `esc` kbd hint, divider, scrollable results list grouped under
uppercase section labels. One result is always "highlighted" (keyboard
cursor); Up/Down move it, Enter activates it, typing filters live, empty
state reads `No results for "<query>"`. Reuse this exact shell for any
"search everything" or "quick actions" entry point — don't build a second
modal pattern for that purpose.

**Toast stack** — bottom-right, stacked with 10px gaps, each toast is a small
bordered pill (icon + one line of text) that slides/fades in
(`translateY(8px)→0` + fade, `0.22s`) and fades out on dismiss. Auto-dismiss
around 2.5–3s. Use for confirming any state-changing UI action (theme
switched, item removed, workspace switched) — don't use `alert()` or block
the UI for these.

## Motion

- **Content fade-in-up** (the signature transition): `opacity 0→1` +
  `translateY(26px)→0`, `0.5s cubic-bezier(.22,1,.36,1)`. Triggered on section
  change by removing the animation class, forcing a reflow
  (`el.offsetWidth`), then re-adding it — this is required to replay the
  animation on every click, not just the first.
- **Marquee scroll**: linear, infinite, duration varies per row (see above).
  Never ease a marquee — it should feel mechanical/continuous.
- **Sidebar collapse**: width transition, `0.28s cubic-bezier(.4,0,.2,1)`.
- **Dropdowns/modals**: fast, `0.14–0.15s`, no bounce.
- **Toasts**: `0.18–0.22s` in/out.
- Respect `prefers-reduced-motion: reduce` globally by collapsing all
  animation/transition durations to near-zero — carry this rule into every
  new build using this system, it's not optional polish.

## Iconography

Inline SVG only, feather-icon style: 24×24 viewbox, `stroke="currentColor"`,
`stroke-width="2"`, no fill except for a few solid glyphs (GitHub mark, the
bookmark-filled state, tile glyphs). Icons inherit color from their parent
text color — never hardcode an icon's stroke color outside the token system.

## Responsive behavior

Single breakpoint at `900px`: sidebar hides entirely, the marquee half of the
hero card hides (left half goes full width), the search trigger collapses to
an icon-only square, dropdowns anchor from the right edge of the viewport
region rather than a fixed width. Don't add intermediate breakpoints unless
the new content specifically needs one — this system is designed to jump
straight from desktop to a simplified mobile layout.

## Accessibility floor

Every interactive element gets a visible focus ring:
`outline: 2px solid var(--accent-cyan); outline-offset: 2px;` via
`:focus-visible`. Maintain this on any new button/input/nav-item. Keep
color contrast text-on-surface at or above what's already in the token file —
don't introduce a new muted tone that's lighter/darker than the existing
`--text-muted` / `--text-faint` pair without checking it still reads clearly
on both themes.