import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, 'public/');
const imageExtensions = ['.jpg', '.jpeg', '.png'];

async function convertToWebP() {
  try {
    const files = fs.readdirSync(sourceDir);
    
    console.log('Starting image conversion to WebP...\n');
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      // Skip if already WebP or not an image
      if (ext === '.webp' || ext === '.svg' || !imageExtensions.includes(ext)) {
        console.log(`⏭️  Skipping: ${file}`);
        continue;
      }
      
      const inputPath = path.join(sourceDir, file);
      const outputFileName = path.basename(file, ext) + '.webp';
      const outputPath = path.join(sourceDir, outputFileName);
      
      try {
        await sharp(inputPath)
          .webp({ quality: 85 }) // 85% quality for good balance
          .toFile(outputPath);
        
        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);
        const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
        
        console.log(`✅ Converted: ${file} → ${outputFileName}`);
        console.log(`   Size: ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (${savings}% smaller)\n`);
      } catch (err) {
        console.error(`❌ Error converting ${file}:`, err.message);
      }
    }
    
    console.log('\n✨ Conversion complete!');
    console.log('\n⚠️  Note: Original files are kept. You can delete them manually after verifying the WebP versions work correctly.');
    console.log('   To delete originals, update your code to use .webp extensions first!');
    
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

convertToWebP();
