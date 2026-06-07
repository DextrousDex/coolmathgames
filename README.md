# Dexter Arcade

A simple static browser-games site ready for Cloudflare Pages.

## Games

The site includes original starter games plus curated open-source browser games embedded from their public project pages:

- 2048 by Gabriele Cirulli: https://github.com/gabrielecirulli/2048
- Hextris: https://github.com/Hextris/hextris
- Astray by wwwtyro: https://github.com/wwwtyro/Astray

## Local Preview

Run a local server from this folder:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Cloudflare Pages

Use these settings when connecting the GitHub repository:

```text
Framework preset: None
Build command: leave blank
Output directory: /
```
