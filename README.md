# Make a Wish

A cinematic React/Vite prototype for the **Make a Wish** concept.

## Current experience

1. Warm sand-colored landing page.
2. User writes a wish on a handwritten-style underline.
3. Clicking the arrow starts the journey.
4. The landing page folds away.
5. A paper plane forms and launches into a generated canvas universe.
6. Stars, planets, orbital rings and a glowing cosmic center animate behind it.
7. The plane returns.
8. A physical-looking paper note reveals:
   **"Message sent to the universe. Hope the universe makes your wish come true."**
9. User can make another wish.

## Run locally

Requirements:

- Node.js 18+
- npm

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Build

```bash
npm run build
```

## Important

This is intentionally the **first real implementation of the visual concept**, not the final production version.

The next engineering phase should replace the CSS flight path with a proper 3D/WebGL paper plane and cinematic camera system, then add backend persistence, privacy controls, sound design, and production performance optimization.


## Responsive layout

The current version is tuned for:

- large desktop / wide monitors
- standard desktop and laptop screens
- tablets
- modern phones
- very small phones
- landscape phones
- short-height displays
- safe-area/notched devices

It uses dynamic viewport units (`svh` / `dvh`), fluid typography, viewport-based sizing, and responsive spacing rather than a fixed desktop canvas.
