# Teaser-Video Generierung - Anleitung

## Ziel
Erzeuge ein 20-Sekunden-Teaser-Video aus dem Bild und MP3 im Ordner `public/`.

## Schritte

### 1. Audio analysieren
- MP3: `public/DJ Hulk Mix-178-Tech House.mp3`
- Dauer: 3628 Sekunden (~60 Min)
- BPM: 128 (Tech House Standard)
- 1 Bar = 4 Beats = 60 Frames (bei 30fps)

### 2. Zufälligen Audio-Offset wählen
- Berechne zufällige Startposition zwischen 30-60 Sekunden
- Schnitt mit ffmpeg: `ffmpeg -i original.mp3 -ss STARTSEKUNDEN -t 20 -c copy teaser_audio.mp3`
- Dies stellt sicher, dass der Teaser nicht im Intro beginnt

### 3. Vorlage anpassen (`src/TeaserCinematicPremium.tsx`)

**Dateipfade korrigieren:**
```tsx
Audio src={staticFile('teaser_audio.mp3')}
Img src={staticFile('Mixcloud Post Mix178.png')}
```

**Aktuelle Animationen:**

| Effekt | Beschreibung | Parameter |
|--------|---------------|------------|
| Hintergrund-Pulsieren | Langsamer rhythmischer Zoom (1.0 → 1.08) alle 60 Frames | `bgZoom = interpolate(Math.sin(frame / 60), [-1, 1], [1.0, 1.08])` |
| Text-Drift | Langsames Wandern nach rechts (150px über 20s) | `textDrift = (frame / 600) * 150` |
| Text-Zoom | Rythmischer Zoom-Effekt (1.0 → 1.04) alle 60 Frames | `textZoom = interpolate(Math.sin(frame / 60), [-1, 1], [1, 1.04])` |
| Equalizer | Frequenzbasierte Visualisierung mit sanfter Wellenbewegung | Siehe unten |

### 4. Equalizer-Implementation

```typescript
{bars.map((v, i) => {
  const barIndex = i / barCount;
  // Frequenzverteilung: Bass in der Mitte, Höhen außen
  const freqBoost = Math.sin(barIndex * Math.PI) * 0.5 + 0.5;
  // Sanfte Wellenbewegung
  const baseWave = Math.sin(frame / (CONFIG.waveFrequency * 2) + i * 0.5) * 15;
  // Bar-Höhe berechnen
  const heightBar = Math.max(6, v * CONFIG.visualizerMultiplier * (0.3 + freqBoost * 0.7) + baseWave + 20);
  return <div ... />;
})}
```

### 5. Zufällige Variationen

Die Zufallswerte wurden temporär deaktiviert - aktuell fixierte Werte:
- `barCount: 64`
- `visualizerMultiplier: 70`
- `waveFrequency: 8`
- `colorVariant: 0` (Cyan→Blau→Lila)

### 6. Video rendern

```bash
npm run build -- TeaserCinematicPremium --output-dir out
```

**Output umbenennen:**
```bash
mv out/TeaserCinematicPremium.mp4 "out/DJ Hulk Mix-178-Tech House_teaser.mp4"
```

## Technische Details

- **Auflösung**: 1920×1080
- **Framerate**: 30fps (600 Frames für 20s)
- **Codec**: h264
- **Audio**: 20s Clip ab zufälliger Position (z.B. 35s)