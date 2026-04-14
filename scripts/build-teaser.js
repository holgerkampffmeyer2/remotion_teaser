const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CONFIG_DIR = path.join(__dirname, '..', 'config');
const OUT_DIR = path.join(__dirname, '..', 'out');

const DEFAULT_CONFIG = {
  title: 'DJ Hulk Sunday House Mix',
  subtitle: 'Checkout the full hour mix on Mixcloud',
  template: 'random',
  startOffset: null,
  variants: 1,
  cacheAudioClip: false,
  effects: {
    lightLeaks: 'random',
    starburst: 'random',
    lightLeaksIntensity: 1.0,
    starburstIntensity: 1.0,
  },
  formats: {
    youtube: true,
    instagram: true
  }
};

const TEMPLATES = ['cinematic-premium', 'neon-wave', 'prism-glass', 'cinematic-poster', 'mono-pulse'];
const VARIANT_MAX = 3;

function selectTemplate(configTemplate) {
  if (configTemplate === 'random') {
    return TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  }
  if (TEMPLATES.includes(configTemplate)) {
    return configTemplate;
  }
  console.warn(`Unknown template "${configTemplate}", using "cinematic-premium"`);
  return 'cinematic-premium';
}

function generateVariations(effectsConfig = {}) {
  const { lightLeaks = 'random', starburst = 'random', lightLeaksIntensity = 1.0, starburstIntensity = 1.0 } = effectsConfig;
  
  const enableLightLeaks = lightLeaks === 'random' 
    ? Math.random() > 0.4 
    : lightLeaks === true;
  
  const enableStarburst = starburst === 'random'
    ? Math.random() > 0.6
    : starburst === true;
  
  const finalLightLeaksIntensity = enableLightLeaks ? lightLeaksIntensity : 0;
  const finalStarburstIntensity = enableStarburst ? starburstIntensity : 0;
  
  return {
    colorPalette: Math.floor(Math.random() * 5),
    speedMultiplier: 0.8 + Math.random() * 0.4,
    equalizerStyle: ['bars', 'wave', 'mirrored', 'circle'][Math.floor(Math.random() * 4)],
    textEffect: ['glow', 'slide', 'scale', 'pulse'][Math.floor(Math.random() * 4)],
    vignette: 0.6 + Math.random() * 0.3,
    bgZoom: 1.0 + Math.random() * 0.15,
    barCount: [32, 64][Math.floor(Math.random() * 2)],
    waveFrequency: [6, 8, 10][Math.floor(Math.random() * 3)],
    bgBrightness: 0.55 + Math.random() * 0.25,
    bgContrast: 1.0 + Math.random() * 0.1,
    bgSaturate: 1.0 + Math.random() * 0.2,
    enableLightLeaks,
    enableStarburst,
    lightLeaksIntensity: finalLightLeaksIntensity * (0.6 + Math.random() * 0.4),
    starburstIntensity: finalStarburstIntensity * (0.5 + Math.random() * 0.5),
    starburstCenterX: 0.3 + Math.random() * 0.4,
    starburstCenterY: 0.2 + Math.random() * 0.2,
  };
}

const MIN_OFFSET = 30;

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function calculateOffset(configuredOffset, maxOffset) {
  if (configuredOffset !== null) {
    if (maxOffset !== null && configuredOffset > maxOffset) {
      return { offset: maxOffset, strategy: 'configured-clamped' };
    }
    return { offset: configuredOffset, strategy: 'configured' };
  }
  
  if (maxOffset !== null && maxOffset > MIN_OFFSET) {
    const randomOffset = Math.floor(Math.random() * (maxOffset - MIN_OFFSET)) + MIN_OFFSET;
    return { offset: randomOffset, strategy: 'random' };
  }
  
  return { offset: MIN_OFFSET, strategy: 'default' };
}

function loadConfig() {
  const configPath = path.join(CONFIG_DIR, 'teaser-config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  console.log('Config not found, using defaults');
  return DEFAULT_CONFIG;
}

function extractMixNumber(filename) {
  const match = filename.match(/(?:Mix| mixes?)\s*-?\s*(\d+)/i);
  return match ? match[1] : null;
}

function findFilesInPublic() {
  const files = fs.readdirSync(PUBLIC_DIR);
  
  const mp3s = files.filter(f => f.endsWith('.mp3') && !f.startsWith('teaser_audio'));
  const pngs = files.filter(f => f.endsWith('.png'));
  
  return { mp3s, pngs };
}

function matchMp3Png(mp3s, pngs) {
  const pairs = [];
  
  for (const mp3 of mp3s) {
    const mp3Num = extractMixNumber(mp3);
    if (!mp3Num) continue;
    
    const matchingPng = pngs.find(p => extractMixNumber(p) === mp3Num);
    if (matchingPng) {
      pairs.push({
        mp3,
        png: matchingPng,
        number: mp3Num
      });
    }
  }
  
  return pairs;
}

function parseTimeFormat(str) {
  if (!str || typeof str !== 'string') return null;
  
  const parts = str.split(':');
  
  if (parts.length === 2 && parts[0] && parts[1]) {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      return minutes * 60 + seconds;
    }
  }
  
  if (parts.length === 1) {
    const numeric = parseInt(str, 10);
    if (!isNaN(numeric)) {
      return numeric;
    }
  }
  
  return null;
}

function getAudioDuration(audioPath) {
  try {
    const output = execSync(`ffprobe -i "${audioPath}" -show_entries format=duration -of csv=p=0`, { encoding: 'utf8' });
    return parseFloat(output.trim());
  } catch (e) {
    console.error('Error getting audio duration:', e.message);
    return null;
  }
}

function createAudioClip(originalMp3, mixNumber, offsetSeconds, maxOffset, cacheAudioClip = false) {
  const clipFileName = `teaser_audio_${mixNumber}.mp3`;
  const clipPath = path.join(PUBLIC_DIR, clipFileName);
  
  if (!cacheAudioClip && fs.existsSync(clipPath)) {
    fs.unlinkSync(clipPath);
    console.log(`Removing existing audio clip: ${clipFileName}`);
  } else if (cacheAudioClip && fs.existsSync(clipPath)) {
    console.log(`Reusing cached audio clip: ${clipFileName}`);
    return clipFileName;
  }
  
  const originalPath = path.join(PUBLIC_DIR, originalMp3);
  
  let finalOffset = offsetSeconds;
  if (maxOffset !== undefined && offsetSeconds > maxOffset) {
    console.warn(`Offset ${offsetSeconds}s exceeds max (${maxOffset}s), clamping to ${maxOffset}s`);
    finalOffset = maxOffset;
  }
  
  try {
    execSync(`ffmpeg -i "${originalPath}" -ss ${finalOffset} -t 20 -c copy "${clipPath}"`, { stdio: 'inherit' });
    console.log(`Created audio clip: ${clipFileName} (starting at ${finalOffset}s)`);
    return clipFileName;
  } catch (e) {
    console.error('Error creating audio clip:', e.message);
    return null;
  }
}

const COMPOSITION_MAP = {
  'cinematic-premium': 'TeaserCinematicPremium',
  'neon-wave': 'TeaserNeonWave',
  'prism-glass': 'TeaserPrismGlass',
  'cinematic-poster': 'TeaserCinematicPoster',
  'mono-pulse': 'TeaserMonoPulse',
};

function renderVideo(mixNumber, audioFile, imageFile, config, format, template, variations, variantIndex = 1) {
  const isInstagram = format === 'instagram';
  const baseCompId = COMPOSITION_MAP[template] || 'TeaserCinematicPremium';
  const compositionId = isInstagram ? `${baseCompId}Instagram` : baseCompId;
  
  const fileNameBase = `DJ Hulk - Mix${mixNumber}_teaser`;
  const variantSuffix = config.variants > 1 ? `_v${variantIndex}` : '';
  const outputFile = isInstagram 
    ? `${fileNameBase}_insta${variantSuffix}.mp4`
    : `${fileNameBase}${variantSuffix}.mp4`;
  
  const props = {
    audioFile,
    imageFile,
    title: config.title,
    subtitle: config.subtitle,
    format,
    ...variations,
  };
  
  const args = [
    'npx', 'remotion', 'render', compositionId,
    '--output-dir', OUT_DIR,
    '--props', JSON.stringify(JSON.stringify(props))
  ];
  
  try {
    execSync(args.join(' '), { stdio: 'inherit' });
    
    const outputPath = path.join(OUT_DIR, `${compositionId}.mp4`);
    const finalPath = path.join(OUT_DIR, outputFile);
    
    if (fs.existsSync(outputPath)) {
      fs.renameSync(outputPath, finalPath);
      console.log(`Video rendered: ${outputFile}`);
    }
  } catch (e) {
    console.error(`Error rendering ${format} video:`, e.message);
  }
}

function main() {
  console.log('=== Teaser Build Script ===\n');
  
  const config = loadConfig();
  
  const variantsCount = Math.min(Math.max(1, config.variants || 1), VARIANT_MAX);
  
  console.log('Config loaded:', {
    title: config.title,
    subtitle: config.subtitle,
    template: config.template,
    startOffset: config.startOffset,
    variants: variantsCount,
    formats: config.formats
  });
  
  const selectedTemplate = selectTemplate(config.template);
  console.log(`Selected template: ${selectedTemplate}\n`);
  
  const configuredOffset = parseTimeFormat(config.startOffset);
  
  const { mp3s, pngs } = findFilesInPublic();
  console.log(`Found ${mp3s.length} MP3s, ${pngs.length} PNGs`);
  
  const pairs = matchMp3Png(mp3s, pngs);
  console.log(`Matched ${pairs.length} MP3/PNG pairs\n`);
  
  if (pairs.length === 0) {
    console.log('No matching MP3/PNG pairs found!');
    process.exit(1);
  }
  
  for (const pair of pairs) {
    console.log(`\nProcessing Mix${pair.number}...`);
    
    const originalPath = path.join(PUBLIC_DIR, pair.mp3);
    const duration = getAudioDuration(originalPath);
    const maxOffset = duration ? Math.floor(duration - 20) : null;
    
    if (duration) {
      console.log(`MP3 duration: ${formatSeconds(Math.floor(duration))} (max offset: ${maxOffset}s)`);
    }
    
    const offsetResult = calculateOffset(configuredOffset, maxOffset);
    console.log(`Offset: ${formatSeconds(offsetResult.offset)} (${offsetResult.offset}s) [${offsetResult.strategy}]`);
    
    const audioFile = createAudioClip(pair.mp3, pair.number, offsetResult.offset, maxOffset, config.cacheAudioClip);
    if (!audioFile) continue;
    
    for (let v = 1; v <= variantsCount; v++) {
      const templateForVariant = config.template === 'random' ? selectTemplate('random') : selectedTemplate;
      const variation = generateVariations(config.effects);
      
      if (config.template === 'random') {
        console.log(`\n--- Variant ${v}/${variantsCount} [${templateForVariant}] ---`);
      } else {
        console.log(`\n--- Variant ${v}/${variantsCount} ---`);
      }
      console.log(`  Template: ${templateForVariant}, Colors: ${variation.colorPalette}, Speed: ${variation.speedMultiplier.toFixed(2)}x, EQ: ${variation.equalizerStyle}, Text: ${variation.textEffect}, LightLeaks: ${variation.enableLightLeaks}, Starburst: ${variation.enableStarburst}`);
      
      if (config.formats.youtube) {
        console.log('\n--- Rendering YouTube (1920x1080) ---');
        renderVideo(pair.number, audioFile, pair.png, config, 'youtube', templateForVariant, variation, v);
      }
      
      if (config.formats.instagram) {
        console.log('\n--- Rendering Instagram (1080x1920) ---');
        renderVideo(pair.number, audioFile, pair.png, config, 'instagram', templateForVariant, variation, v);
      }
    }
  }
  
  console.log('\n=== Done ===');
}

if (require.main === module) {
  main();
}

module.exports = {
  DEFAULT_CONFIG,
  TEMPLATES,
  loadConfig,
  extractMixNumber,
  findFilesInPublic,
  matchMp3Png,
  parseTimeFormat,
  formatSeconds,
  calculateOffset,
  selectTemplate,
  generateVariations,
  getAudioDuration,
  createAudioClip,
  renderVideo,
  main,
};
