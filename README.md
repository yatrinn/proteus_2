# Proteus website

Static website for Proteus: shape-shifting robots for confined spaces. The modules pass through a Ø200 mm opening as a chain and lock into a rigid structure inside.

No build step, no cookies, no tracking, no third-party requests. Fonts are self-hosted.

## Structure

| Path | Content |
|---|---|
| `index.html` | Landing page |
| `impressum.html`, `privacy.html` | Legal pages (German) |
| `404.html` | Not-found page (absolute paths assume the site is served at `/proteus/`) |
| `assets/css/site.css` | Design tokens, components, layout |
| `assets/js/main.js` | Mobile menu, videos that play only while visible (each with a pause control), reveal on scroll |
| `assets/fonts/` | Archivo and IBM Plex Mono (SIL Open Font License 1.1) |
| `assets/media/` | Concept renderings (Blender, EEVEE) and prototype clips, each with a poster image |
| `assets/img/` | Favicon and social preview image |

## Media

The concept renderings are generated from computed poses: follow-the-leader kinematics for the chain, inverse kinematics and a static-stability check for the walker, and a stiffness solution of the truss for the load-path pulses. Prototype clips are unedited manual tests of the MK1.2 modules.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`.

## Credits

Archivo © The Archivo Project Authors (OFL 1.1). IBM Plex Mono © IBM Corp. (OFL 1.1).
