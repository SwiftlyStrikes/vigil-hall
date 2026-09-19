# Vigil Hall — installable mobile app (PWA)

This folder is the mobile build packaged as a progressive web app. Hosted on any plain web address it installs to a
phone's home screen, launches full-screen in landscape, plays offline, and keeps its saves (they live in the browser's
storage for that address, so keep the address the same when you update).

## Files
- `index.html` — the game (the mobile build) with the app tags and service-worker hookup
- `manifest.webmanifest` — name, icons, colours, full-screen landscape
- `sw.js` — caches the game for offline play; bump `CACHE` when you upload a new build
- `icons/` — home-screen icons (192, 512, maskable, Apple touch icon, favicon)

## Put it online with GitHub Pages (free, ~5 minutes)
1. Make a GitHub account if you don't have one, then create a new repository (any name, e.g. `vigil-hall`), public.
2. Upload everything in this folder to the repository (drag the files and the `icons` folder into the "Add file → Upload files" page). Keep the names as they are.
3. In the repository, open Settings → Pages. Under "Build and deployment", set Source to "Deploy from a branch", pick the `main` branch and the `/ (root)` folder, and save.
4. After a minute the page shows your address, like `https://<your-name>.github.io/vigil-hall/`. Open it on your phone.

Any static host works the same way (Netlify Drop, Cloudflare Pages, itch.io as an HTML game). The only requirements
are `https` and that the files sit together in one folder.

## Install it on a phone
- **Android (Chrome):** open the address; Chrome offers "Install" in the menu (⋮) or a banner. It becomes an app icon.
- **iPhone (Safari):** open the address, tap Share, then "Add to Home Screen". iOS runs it full-screen from the icon.

## Updating
Upload the new `index.html` (and change `CACHE = "vigil-hall-v1"` in `sw.js` to `v2`, `v3`, …). Installed phones pick the
new version up the next time the app is opened with a connection.
