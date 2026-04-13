# Teaser-Video Generierung - Anleitung

## Ziel
Erzeuge 20-Sekunden-Teaser-Videos aus MP3/PNG-Dateien im Ordner `public/`.

## Schnellstart

```bash
npm run teaser
```

Dies erstellt für jedes MP3/PNG-Paar in `public/` ein Teaser-Video.

## Dateistruktur

```
public/
├── DJ Hulk - Mix176_Tech House.mp3   # Quelldatei (wird nicht getrackt)
├── Mixcloud Post Mix176.png          # Cover-Bild (wird nicht getrackt)
└── teaser_audio_176.mp3               # Generierter Audio-Clip (wird getrackt)

config/
└── teaser-config.json                # Texte für das Video

out/
└── DJ Hulk - Mix176_teaser.mp4      # Output
```

## Konfiguration

Bearbeite `config/teaser-config.json`:

```json
{
  "title": "DJ Hulk Sunday House Mix",
  "subtitle": "Checkout the full hour mix on Mixcloud"
}
```

## Funktionsweise

### 1. Matching-Logik
- Script sucht alle MP3 und PNG in `public/`
- Paart sie anhand der Nummer im Dateinamen (Mix176 ↔ Mix176)
- Nur passende Paare werden verarbeitet

### 2. Audio-Verarbeitung
- Zufälliger Offset zwischen 30-60 Sekunden
- FFmpeg erstellt 20s Clip: `public/teaser_audio_{NUM}.mp3`

### 3. Video-Rendering
- Verwendet `TeaserCinematicPremium` Komponente
- Props werden automatisch übergeben:
  - `audioFile`: `teaser_audio_{NUM}.mp3`
  - `imageFile`: `Mixcloud Post Mix{NUM}.png`
  - `title`: Aus Config
  - `subtitle`: Aus Config

## Technische Details

| Parameter | Wert |
|-----------|------|
| Auflösung | 1920×1080 |
| Framerate | 30fps |
| Dauer | 20s (600 Frames) |
| Codec | h264 |

## Manuelles Rendering

Falls du nur ein einzelnes Video rendern möchtest:

```bash
npm run build -- TeaserCinematicPremium --output-dir out --props '{"audioFile":"teaser_audio_176.mp3","imageFile":"Mixcloud Post Mix176.png","title":"Titel","subtitle":"Subtitel"}'
```
