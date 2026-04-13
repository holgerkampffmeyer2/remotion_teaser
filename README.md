# Teaser Video Generator

![AI-Powered Teaser Video Generation](assets/animate.png)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Automated creation of teaser videos for DJ mixes in multiple formats.

## Features

- **Automatic File Detection** - Finds MP3/PNG pairs in `public/`
- **Multi-Format Output** - YouTube (1920×1080) and Instagram Reels (1080×1920)
- **Audio Visualization** - Equalizer bars that react to the music
- **Configurable Text** - Title and subtitle via JSON config

## Quick Start

```bash
npm run teaser
```

Automatically creates videos for all detected MP3/PNG pairs.

## Project Structure

```
animate_vid/
├── config/
│   └── teaser-config.json     # Text configuration
├── public/
│   ├── DJ Hulk - Mix176_Tech House.mp3   # Source file
│   └── Mixcloud Post Mix176.png           # Cover image
├── scripts/
│   └── build-teaser.js      # Build script
├── src/
│   ├── Root.tsx            # Remotion root
│   └── TeaserCinematicPremium.tsx  # Video component
├── out/
│   └── *.mp4               # Output videos
└── package.json
```

## Configuration

Edit `config/teaser-config.json`:

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

### Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `title` | Main title in the video | - |
| `subtitle` | Subtitle | - |
| `formats.youtube` | YouTube format (16:9) | `true` |
| `formats.instagram` | Instagram Reels format (9:16) | `true` |

## Usage

### Adding Source Files

1. Place MP3 file in `public/` (e.g., `DJ Hulk - Mix176_Tech House.mp3`)
2. Place PNG cover in `public/` (e.g., `Mixcloud Post Mix176.png`)

The script detects matching pairs by the number in the filename (Mix176 ↔ Mix176).

### Generating Videos

```bash
npm run teaser
```

Output:
- `out/DJ Hulk - Mix176_teaser.mp4` - YouTube format
- `out/DJ Hulk - Mix176_teaser_insta.mp4` - Instagram format

## Technical Details

| Parameter | YouTube | Instagram |
|-----------|---------|-----------|
| Resolution | 1920×1080 | 1080×1920 |
| Aspect Ratio | 16:9 | 9:16 |
| Framerate | 30 fps | 30 fps |
| Duration | 20s | 20s |
| Codec | H.264 | H.264 |

## Development

### Start Dev Server

```bash
npm start
```

### Manual Render

```bash
npm run build -- TeaserCinematicPremium --output-dir out --props '{"audioFile":"...","imageFile":"...","title":"...","subtitle":"...","format":"youtube"}'
```

## Tech Stack

- [Remotion](https://www.remotion.dev/) - Video in React
- React 18
- TypeScript
- FFmpeg (for audio processing)

## License

MIT

---

**Holger Kampffmeyer** (DJ Hulk)

- Website: [holger-kampffmeyer.de](https://holger-kampffmeyer.de)
- Email: holger.kampffmeyer+dj@gmail.com
- Instagram: [@djhulk_de](https://instagram.com/djhulk_de)
- YouTube: [@djhulk_de](https://youtube.com/@djhulk_de)
- Mixcloud: [holger-kampffmeyer](https://mixcloud.com/holger-kampffmeyer)
- LinkedIn: [holger-kampffmeyer](https://linkedin.com/in/holger-kampffmeyer-390b6789)

**Note**: This tool is designed to be used with AI coding assistants.
