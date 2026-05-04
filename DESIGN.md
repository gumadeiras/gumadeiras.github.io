# Design Notes

This site should feel like a personal research notebook with a sharp terminal
edge: quiet, text-first, compact, a little odd, and never over-produced.

Use this file as the design contract before changing layout, typography, color,
or components. Prefer small edits that preserve the site's existing rhythm.

## Visual DNA

- Dense, readable lists over marketing sections.
- Monospace everywhere. No mixed type system unless there is a strong reason.
- Red links as the main visual signal.
- Muted grayscale surfaces; no heavy panels, shadows, gradients, or hero cards.
- Small hand-drawn-feeling icon accents are okay when they clarify identity.
- UI should feel authored, not templated.

## Color

Source of truth: `_sass/_main.scss`.

Light theme:

- Page background: `#f2f2f2`
- Main text: `#333`
- Strong text: `#111`
- Medium text: `#555`
- Light text: `#bbb`
- Paper dates: `#888`
- Link/accent red: `#df0505`
- Soft code/background chip: `rgb(236, 237, 238)`

Dark theme:

- Page background: `#0d1117`
- Main text: `#ddd`
- Strong text: `#eee`
- Medium text: `#888`
- Light text: `#444`
- Paper dates: `#999`
- Link/accent red: `#df0505`
- Soft code/background chip: `#333`

Rules:

- Keep red as the only dominant accent.
- Do not add broad new color families.
- If adding color, define it as a CSS custom property first.
- Check both light and dark themes before shipping.

## Typography

- Font: local `Fira Code` only.
- Body size: `clamp(15px, 2vw, 16px)`.
- Body line-height: `1.75`.
- Headings use the same size as body text and rely on weight, spacing, and case.
- Avoid display-scale typography. This site should stay compact.
- Preserve tabular numerals for dates and citation metadata.

## Layout

- Main content max width: `55rem`.
- Main padding: `2.4rem 2rem`; mobile padding: `0 1.25rem`.
- Main top offset: `margin: -5rem auto 0`.
- Sections have generous vertical separation: `margin-top: 5.5rem`.
- Lists are flex rows on desktop and wrap cleanly on mobile.
- Avoid cards inside page sections. The site is mostly unframed text.

Responsive rules:

- At `45rem` and below, paper rows wrap.
- Paper title gets the full first row.
- Citation badge and date sit below in compact metadata rows.
- Never let long titles force horizontal scroll.

## Components

### Links

- Default links are red and underlined.
- `stealth-link` is for hidden affordances like `hello.` on the homepage.
- External post-content links are upgraded to open in a new tab by
  `_layouts/default.html`.

### Homepage Link Icons

- Use `.me-link` for icon plus label links.
- Icons should align inline with text and stay small: about `1em`.
- Prefer existing SVG assets before adding new ones.
- New icons should be simple, monochrome, and mask-friendly.

### Theme Toggle

- Keep the toggle icon-only.
- Keep dimensions stable at `28px`.
- Preserve `aria-label`, `aria-pressed`, focus-visible outline, and reduced-motion
  behavior.

### Paper Lists

- Keep paper rows scan-friendly:
  title, flexible spacer/meta, date.
- Dates are muted and tabular.
- Archive-only citation badges use `.badge` and `.badge__icon`.
- Badge number circles rely on flex centering and `line-height: 1`; do not remove
  that or the number will drift vertically.

### Collapsible Sections

- Use native `details` and `summary`.
- The summary marker is text-based: `+` when closed, `-` when open.
- Preserve reduced-motion behavior and keyboard focus styles.

### Posts

- Post pages start with a compact back link and theme toggle.
- Titles are uppercase via `h1`, body-sized, and bold.
- Reading time is shown next to the date.
- Figures max out at `min(75%, 100%)`, then full width on mobile.
- Footnotes are smaller, muted, and separated by a single thin rule.

## Motion

- Motion should be rare and functional.
- Current accepted motion:
  - theme toggle transition
  - collapsible-section height/opacity transition
- Always respect `prefers-reduced-motion`.
- Do not add hover animations just to add motion.

## Content Tone

- Lowercase is intentional in visible UI text.
- Prefer short labels: `some papers`, `links (me)`, `etc`, `go back`.
- Avoid explanatory UI copy.
- Avoid marketing language, product-page structure, and decorative CTAs.

## Implementation Rules

- Edit `_sass/_main.scss` for source styles.
- `assets/css/main.css` is the Jekyll/Sass entrypoint; do not duplicate styles
  there unless changing the Sass entrypoint itself.
- Keep Liquid templates simple and readable.
- Do not introduce a frontend framework.
- Do not add a design dependency for a one-off component.
- For visual changes, run `script/build_site.sh`.
- If touching live visual behavior, verify the generated page locally and in both
  themes when practical.

## Do Not Drift

- No landing-page hero treatment.
- No cards for ordinary content.
- No shadows or glass effects.
- No generic component-library styling.
- No multi-font redesign.
- No oversized buttons, pills, or badges except where already established.
- No extra explanatory text around navigation or controls.
- No unrelated palette expansion.

## Good Change Examples

- Tightening alignment or spacing while preserving the text rhythm.
- Adding a small icon treatment that matches `.me-link`.
- Improving mobile wrapping for paper rows.
- Clarifying post typography without changing scale.
- Making focus, reduced-motion, or contrast behavior more robust.

## Bad Change Examples

- Turning the homepage into a portfolio landing page.
- Replacing the compact paper list with cards.
- Adding a large hero, gradient background, or decorative blob.
- Switching to a proportional sans font.
- Making links look like buttons.
- Introducing a new accent color for a single feature.
