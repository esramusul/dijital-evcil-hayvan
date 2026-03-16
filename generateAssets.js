const fs = require('fs');
const path = require('path');
const { WaveFile } = require('wavefile');
const Jimp = require('jimp');

const SOUNDS_DIR = path.join(__dirname, 'assets', 'sounds');
const PETS_DIR = path.join(__dirname, 'assets', 'images', 'pets');

if (!fs.existsSync(SOUNDS_DIR)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
}

// 1. Generate Synth Sounds
function generateSound(filename, type, freq, duration, sweep=0) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float64Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const currentFreq = freq + (sweep * t * freq);
    let val = 0;

    if (type === 'sine') val = Math.sin(2 * Math.PI * currentFreq * t);
    if (type === 'square') val = Math.sin(2 * Math.PI * currentFreq * t) > 0 ? 0.5 : -0.5;
    if (type === 'saw') val = 2 * (t * currentFreq - Math.floor(t * currentFreq + 0.5));
    if (type === 'triangle') val = 2 * Math.abs(2 * (t * currentFreq - Math.floor(t * currentFreq + 0.5))) - 1;

    // envelope
    let env = 1.0;
    if (i < 0.1 * sampleRate) env = i / (0.1 * sampleRate);
    if (i > numSamples - 0.1 * sampleRate) env = (numSamples - i) / (0.1 * sampleRate);

    samples[i] = val * env * 0.5 * 32767;
  }

  const wav = new WaveFile();
  wav.fromScratch(1, sampleRate, '16', samples);
  fs.writeFileSync(path.join(SOUNDS_DIR, filename), wav.toBuffer());
}

try {
  generateSound('eat.wav', 'square', 800, 0.15);
  generateSound('full.wav', 'sine', 1200, 0.4, 1.5); // Ascending
  generateSound('play.wav', 'triangle', 600, 0.3, 0.5);
  generateSound('bath.wav', 'sine', 400, 0.5, -0.2); // Descending bubbly
  generateSound('flush.wav', 'saw', 200, 0.8, -0.5); // Low rumble
  generateSound('sleep.wav', 'sine', 300, 1.0, -0.1);
  generateSound('wake.wav', 'sine', 700, 0.5, 0.5);
  generateSound('levelup.wav', 'square', 900, 0.6, 1.0);
  generateSound('grow.wav', 'triangle', 500, 0.8, -0.3);
  console.log("Sounds generated successfully!");
} catch (err) {
  console.error("Error generating sounds:", err);
}

// 2. Remove White/Light Background from Pet PNGs
async function removeBg(petFile) {
  const filePath = path.join(PETS_DIR, petFile);
  if (!fs.existsSync(filePath)) return;

  try {
    const image = await Jimp.read(filePath);
    console.log(`Processing ${petFile} (Size: ${image.bitmap.width}x${image.bitmap.height})`);
    
    // Basit chroma-key benzeri (beyaz ve beyaza yakınları sil)
    // Kenarlarda yumuşatma yapmak için tolerance verilir
    const tolerance = 40; 
    
    // Köşedeki piksel rengini arka plan rengi kabul edelim (0,0)
    const bgColor = Jimp.intToRGBA(image.getPixelColor(0, 0));

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      const rDiff = Math.abs(r - bgColor.r);
      const gDiff = Math.abs(g - bgColor.g);
      const bDiff = Math.abs(b - bgColor.b);

      if (rDiff < tolerance && gDiff < tolerance && bDiff < tolerance) {
        // Tamamen şeffaf yap
        this.bitmap.data[idx + 3] = 0; 
      }
    });

    await image.writeAsync(filePath);
    console.log(`Successfully removed background from ${petFile}`);
  } catch (err) {
    console.error(`Error processing ${petFile}:`, err);
  }
}

async function processAll() {
  await removeBg('bird.png');
  await removeBg('cat.png');
  await removeBg('dog.png');
  console.log("All assets generated/processed!");
}

processAll();
