const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CONFIG_DIR = path.join(__dirname, '..', 'config');
const OUT_DIR = path.join(__dirname, '..', 'out');

const DEFAULT_CONFIG = {
  title: 'DJ Hulk Sunday House Mix',
  subtitle: 'Checkout the full hour mix on Mixcloud'
};

function loadConfig() {
  const configPath = path.join(CONFIG_DIR, 'teaser-config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  console.log('Config not found, using defaults');
  return DEFAULT_CONFIG;
}

function extractMixNumber(filename) {
  const match = filename.match(/(?:Mix| mixes?)(\d+)/i);
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

function getAudioDuration(audioFile) {
  try {
    const output = execSync(`ffprobe -i "${path.join(PUBLIC_DIR, audioFile)}" -show_entries format=duration -of default=noprint_wrappers=1:nokey=1`, { encoding: 'utf8' });
    return parseFloat(output.trim());
  } catch (e) {
    console.error('Error getting audio duration:', e.message);
    return 0;
  }
}

function createAudioClip(originalMp3, mixNumber, offsetSeconds) {
  const clipFileName = `teaser_audio_${mixNumber}.mp3`;
  const clipPath = path.join(PUBLIC_DIR, clipFileName);
  
  if (fs.existsSync(clipPath)) {
    console.log(`Audio clip already exists: ${clipFileName}`);
    return clipFileName;
  }
  
  const originalPath = path.join(PUBLIC_DIR, originalMp3);
  
  try {
    execSync(`ffmpeg -i "${originalPath}" -ss ${offsetSeconds} -t 20 -c copy "${clipPath}"`, { stdio: 'inherit' });
    console.log(`Created audio clip: ${clipFileName}`);
    return clipFileName;
  } catch (e) {
    console.error('Error creating audio clip:', e.message);
    return null;
  }
}

function renderVideo(mixNumber, audioFile, imageFile, config) {
  const outputFile = `DJ Hulk - Mix${mixNumber}_teaser.mp4`;
  
  const env = {
    ...process.env,
    TEASER_AUDIO_FILE: audioFile,
    TEASER_IMAGE_FILE: imageFile,
    TEASER_TITLE: config.title,
    TEASER_SUBTITLE: config.subtitle
  };
  
  const args = [
    'npx', 'remotion', 'render', 'TeaserCinematicPremium',
    '--output-dir', OUT_DIR,
    '--props', JSON.stringify(JSON.stringify({
      audioFile,
      imageFile,
      title: config.title,
      subtitle: config.subtitle
    }))
  ];
  
  try {
    execSync(args.join(' '), { stdio: 'inherit', env });
    
    const outputPath = path.join(OUT_DIR, 'TeaserCinematicPremium.mp4');
    const finalPath = path.join(OUT_DIR, outputFile);
    
    if (fs.existsSync(outputPath)) {
      fs.renameSync(outputPath, finalPath);
      console.log(`Video rendered: ${outputFile}`);
    }
  } catch (e) {
    console.error('Error rendering video:', e.message);
  }
}

function main() {
  console.log('=== Teaser Build Script ===\n');
  
  const config = loadConfig();
  console.log('Config loaded:', config);
  
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
    
    const offset = Math.floor(Math.random() * 31) + 30;
    console.log(`Random offset: ${offset}s`);
    
    const audioFile = createAudioClip(pair.mp3, pair.number, offset);
    if (!audioFile) continue;
    
    renderVideo(pair.number, audioFile, pair.png, config);
  }
  
  console.log('\n=== Done ===');
}

main();
