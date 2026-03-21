import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';

const filesToProcess = [
  {
    path: './seeder.js',
    downloadDir: './uploads/seed',
    replacementPrefix: '/uploads/seed/'
  },
  {
    path: '../frontend/src/data/content.js',
    downloadDir: '../frontend/public/seed',
    replacementPrefix: '/seed/'
  },
  {
    path: '../frontend/src/pages/Home.jsx',
    downloadDir: '../frontend/public/seed',
    replacementPrefix: '/seed/'
  },
  {
    path: '../frontend/src/pages/About.jsx',
    downloadDir: '../frontend/public/seed',
    replacementPrefix: '/seed/'
  }
];

const downloadImage = async (url, filepath) => {
  const writer = fs.createWriteStream(filepath);
  // Unsplash images are high-res, increase timeout and buffer
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 30000,
    maxRedirects: 5
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const processFiles = async () => {
  const urlRegex = /https:\/\/images\.unsplash\.com\/[^\s\"\'\`\\]+/g;

  for (const fileDef of filesToProcess) {
    console.log(`\nProcessing ${fileDef.path}...`);
    
    // Ensure download directory exists
    if (!fs.existsSync(fileDef.downloadDir)) {
      fs.mkdirSync(fileDef.downloadDir, { recursive: true });
    }

    if (!fs.existsSync(fileDef.path)) {
      console.log(`File not found: ${fileDef.path}, skipping.`);
      continue;
    }

    let content = fs.readFileSync(fileDef.path, 'utf8');
    const matches = [...new Set(content.match(urlRegex) || [])];
    
    console.log(`Found ${matches.length} unique Unsplash URLs.`);

    for (const url of matches) {
      // Create a unique filename based on the URL
      const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 10);
      const filename = `img_${hash}.jpg`;
      const localFilePath = path.join(fileDef.downloadDir, filename);
      const replacementPath = `${fileDef.replacementPrefix}${filename}`;

      // Download if not exists
      if (!fs.existsSync(localFilePath)) {
        console.log(`Downloading: ${url}`);
        try {
          await downloadImage(url, localFilePath);
          console.log(`Saved to ${localFilePath}`);
        } catch (err) {
          console.error(`Error downloading ${url}:`, err.message);
          fs.unlink(localFilePath, () => {}); // clean up partial file
          continue; // skip replacing if download fails
        }
      } else {
        console.log(`Already exists: ${localFilePath}`);
      }

      // Replace in content (global replace)
      // Escape URL for regex
      const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const replaceRegex = new RegExp(escapedUrl, 'g');
      content = content.replace(replaceRegex, replacementPath);
    }

    // Write modified content back
    fs.writeFileSync(fileDef.path, content, 'utf8');
    console.log(`Updated file: ${fileDef.path}`);
  }
  
  console.log("\n✅ All external images localized!");
};

processFiles().catch(console.error);
