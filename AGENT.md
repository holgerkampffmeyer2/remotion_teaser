# Teaser-Video Generierung - Anleitung

## Ziel
Erzeuge 20-Sekunden-Teaser-Videos aus MP3/PNG-Dateien im Ordner `public/`.

## Schnellstart

### Studio starten (Editor)
```bash
pnpm start
```
Dann im Browser: http://localhost:3000

### Video rendern
```bash
pnpm teaser
```

## Dateistruktur

```
public/
├── DJ Hulk - Mix176_Tech House.mp3   # Quelldatei
├── Mixcloud Post Mix176.png          # Cover-Bild
└── teaser_audio_176.mp3              # Generierter Audio-Clip

config/
└── teaser-config.json                # Konfiguration

scripts/
├── build-teaser.js                   # Build-Script
└── build-teaser.test.js              # Tests

src/
├── Root.tsx                          # Remotion Root (5 Templates)
├── Effects.tsx                       # Light Leaks & Starburst
├── TeaserCinematicPremium.tsx
├── TeaserNeonWave.tsx
├── TeaserPrismGlass.tsx
├── TeaserCinematicPoster.tsx
└── TeaserMonoPulse.tsx

out/
└── DJ Hulk - Mix176_teaser.mp4      # Output
```

## Konfiguration

Bearbeite `config/teaser-config.json`:

```json
{
  "title": "DJ Hulk Sunday House Mix",
  "subtitle": "Checkout the full hour mix on Mixcloud",
  "template": "random",
  "startOffset": "1:00",
  "variants": 1,
  "cacheAudioClip": false,
  "formats": {
    "youtube": true,
    "instagram": false
  }
}
```

### Optionen

| Parameter | Beschreibung | Standard |
|-----------|-------------|-----------|
| `title` | Haupttitel im Video | - |
| `subtitle` | Untertitel | - |
| `template` | Template: "random", "cinematic-premium", "neon-wave", "prism-glass", "cinematic-poster", "mono-pulse" | "random" |
| `startOffset` | Audio-Startzeit (MM:SS oder null für zufällig) | null |
| `variants` | Anzahl Varianten pro Mix (1-3) | 1 |
| `cacheAudioClip` | Vorhandenen Audio-Clip wiederverwenden | false |
| `formats.youtube` | YouTube Format (16:9) | true |
| `formats.instagram` | Instagram Reels Format (9:16) | true |

## Funktionsweise

### 1. Matching-Logik
- Script sucht alle MP3 und PNG in `public/`
- Paart sie anhand der Nummer im Dateinamen:
  - `Mix176` ↔ `Mix176`
  - `Mix-178` ↔ `Mix178`
- Nur passende Paare werden verarbeitet

### 2. Audio-Verarbeitung
- Zufälliger Offset zwischen 30s und (MP3-Länge - 20s)
- Oder fixed Offset via `startOffset` (z.B. "1:00")
- FFmpeg erstellt 20s Clip: `public/teaser_audio_{NUM}.mp3`
- Mit `cacheAudioClip: false` wird der Clip jedes Mal neu erstellt

### 3. Video-Rendering
- 5 Templates: cinematic-premium, neon-wave, prism-glass, cinematic-poster, mono-pulse
- Mit `template: "random"` wird jedes Mal ein zufälliges Template gewählt
- Props werden automatisch übergeben

### 4. Variations-System
Jedes Video erhält zufällige Variationen:

| Variation | Bereich |
|-----------|-----------|
| Farbpalette | 5 Optionen (Cyber Cyan, Sunset Pulse, Acid Green, Neon Pink, Steel Blue) |
| Speed | 0.8x - 1.2x |
| Text-Effekt | glow, slide, scale, pulse |
| Equalizer | bars, wave, mirrored, circle |
| Vignette | 0.6 - 0.9 |
| Hintergrund-Zoom | 1.0 - 1.15 |
| Light Leaks | ~60% Wahrscheinlichkeit |
| Starburst | ~40% Wahrscheinlichkeit |

## Template-Eigenheiten

| Template | Layout | Visualizer | Text-Effekt | Besonderheiten |
|----------|--------|-----------|-------------|--------------|
| **MonoPulse** | Zentriert | Bars (gleichmäßig) | Glow (pulsierend) | Pulse-Rhythmus |
| **CinematicPoster** | Unten links | Bars (Drift) | Glow/Slide/Scale | Drift-Animation |
| **PrismGlass** | Zentriert + Cards | Mini-Bars in Frames | Glow/Slide/Scale | Glassmorphism |
| **NeonWave** | Zentriert | Gespiegelt | Glow | HSL-Farbshift |
| **CinematicPremium** | Seitlich | Bars | Glow/Slide/Scale (pulsierend) | Vignette, Styles |

## Technische Details

| Parameter | Wert |
|-----------|------|
| Auflösung YouTube | 1920×1080 |
| Auflösung Instagram | 1080×1920 |
| Framerate | 30fps |
| Dauer | 20s (600 Frames) |
| Codec | h264 |

## Tests

```bash
pnpm test
```

27 Tests für:
- Zeitformat-Parsing
- Offset-Berechnung
- Template-Auswahl
- Variations-Generierung
- Effects-Konfiguration
- Mix-Number-Extraktion

## Entwicklung

### Einzelnes Template rendern

```bash
# Template in Config setzen und teaser starten
"template": "cinematic-premium"
pnpm teaser
```

### Beispiel: 3 Varianten mit random Templates

```json
{
  "template": "random",
  "variants": 3
}
```

Dies erstellt 3 verschiedene Videos mit unterschiedlichen Templates und Effects.