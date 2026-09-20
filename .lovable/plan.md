# Link-in-bio wordmark glitch

## Goal
Give the “romergarcia” title on `/links` a one-time chromatic-aberration glitch when the page first loads, matching the visual language of the homepage hero without affecting readability afterward.

## Implementation
- Add a focused wordmark component or local animation state for the `/links` title.
- Layer red and cyan copies behind the main wordmark, preserving the existing medium “romer” and thin “garcia” weights.
- Animate a short offset-and-settle sequence only on first mount, with a restrained horizontal glitch slice for the initial burst.
- Respect reduced-motion preferences by showing the settled title immediately.
- Keep the title’s current size, alignment, spacing, and light/dark theme behavior unchanged.

## Validation
- Verify the effect plays once on initial page load.
- Confirm the title settles sharply with no lingering offset.
- Check mobile and desktop layouts and ensure no browser errors.
