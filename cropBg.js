const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const pets = ['bird.png', 'cat.png', 'dog.png'];
const PETS_DIR = path.join(__dirname, 'assets', 'images', 'pets');

async function processPet(file) {
    const filePath = path.join(PETS_DIR, file);
    if (!fs.existsSync(filePath)) return;
    
    try {
        const image = await Jimp.read(filePath);
        console.log(`Processing ${file}...`);
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            
            // Eğer renk beyaz üzerine ise (arka plan)
            if (r > 230 && g > 230 && b > 230) {
                this.bitmap.data[idx + 3] = 0; // saydam
            } else if (r > 200 && g > 200 && b > 200) {
                this.bitmap.data[idx + 3] = 120; // yarı saydam
            }
        });

        // Tüm boş, saydam olan kenarlıkları otomatik keser.
        image.autocrop(); 
        
        await image.writeAsync(filePath);
        console.log(`Processed and autocropped ${file}`);
    } catch (e) {
        console.error(`Error on ${file}`, e);
    }
}

async function run() {
    for (const pet of pets) await processPet(pet);
}
run();
