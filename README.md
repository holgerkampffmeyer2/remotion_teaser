# Teaser Video Generator

Automatisierte Erstellung von Teaser-Videos für DJ-Mixe in mehreren Formaten.

## Features

- **Automatische Dateierkennung** - Sucht MP3/PNG-Paare in `public/`
- **Multi-Format Output** - YouTube (1920×1080) und Instagram Reels (1080×1920)
- **Audio-Visualisierung** - Equalizer-Balken, die auf die Musik reagieren
- **Konfigurierbarer Text** - Titel und Subtitle via JSON-Config

## Schnellstart

```bash
npm run teaser
```

Erstellt automatisch Videos für alle gefundenen MP3/PNG-Paare.

## Projektstruktur

```
animate_vid/
├── config/
│   └── teaser-config.json     # Text-Konfiguration
├── public/
│   ├── DJ Hulk - Mix176_Tech House.mp3   # Quelldatei
│   └── Mixcloud Post Mix176.png           # Cover-Bild
├── scripts/
│   └── build-teaser.js      # Build-Script
├── src/
│   ├── Root.tsx            # Remotion Root
│   └── TeaserCinematicPremium.tsx  # Video-Komponente
├── out/
│   └── *.mp4               # Output-Videos
└── package.json
```

## Konfiguration

Bearbeite `config/teaser-config.json`:

```json
{
  "title": "DJ Hulk Sunday House Mix",
  "subtitle": "Checkout the full hour mix on Mixcloud",
  "formats": {
    "youtube": true,
    "instagram": true
  }
}
```

### Optionen

| Parameter | Beschreibung | Standard |
|-----------|--------------|----------|
| `title` | Hauptitel im Video | - |
| `subtitle` | Untertitel | - |
| `formats.youtube` | YouTube-Format (16:9) | `true` |
| `formats.instagram` | Instagram-Reels-Format (9:16) | `true` |

## Verwendung

### Quelldateien hinzufügen

1. MP3-Datei in `public/` legen (z.B. `DJ Hulk - Mix176_Tech House.mp3`)
2. PNG-Cover in `public/` legen (z.B. `Mixcloud Post Mix176.png`)

Das Script erkennt passende Paare anhand der Nummer im Dateinamen (Mix176 ↔ Mix176).

### Videos generieren

```bash
npm run teaser
```

Output:
- `out/DJ Hulk - Mix176_teaser.mp4` - YouTube Format
- `out/DJ Hulk - Mix176_teaser_insta.mp4` - Instagram Format

## Technische Details

| Parameter | YouTube | Instagram |
|-----------|---------|-----------|
| Auflösung | 1920×1080 | 1080×1920 |
| Aspect Ratio | 16:9 | 9:16 |
| Framerate | 30 fps | 30 fps |
| Dauer | 20s | 20s |
| Codec | H.264 | H.264 |

## Entwicklung

### Dev-Server starten

```bash
npm start
```

### Manuell rendern

```bash
npm run build -- TeaserCinematicPremium --output-dir out --props '{"audioFile":"...","imageFile":"...","title":"...","subtitle":"...","format":"youtube"}'
```

## Tech Stack

- [Remotion](https://www.remotion.dev/) - Video in React
- React 18
- TypeScript
- FFmpeg (für Audio-Verarbeitung)

## Lizenz

MIT
