# Mobile tilt parallax for the Links page

## What will change
- Add a lightweight tilt controller used only on `/links` at mobile widths.
- Move the camera-lens background gently opposite the phone tilt to create depth without shifting the page content.
- Smooth motion with `requestAnimationFrame`, clamp extreme sensor values, and return the image to center when motion stops.
- Respect reduced-motion settings and disable the effect on non-mobile screens.
- Handle iPhone motion permission with a one-time, unobtrusive enable control only when Safari requires it.

## Validation
- Verify the page remains centered and readable at phone size.
- Verify fallback behavior without motion permission and with reduced motion enabled.
- Confirm there are no browser errors and desktop presentation remains unchanged.
