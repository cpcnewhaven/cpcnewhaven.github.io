#!/usr/bin/env node

/**
 * Script to update the Retreat 2025 gallery with images from Google Drive
 * 
 * This script helps populate the retreat2025-images.json file with images
 * from the Google Drive folder. Since Google Drive doesn't provide a public
 * API for shared folders, this script provides a way to manually add images.
 * 
 * Usage:
 * 1. Get the direct image URLs from Google Drive
 * 2. Run: node scripts/update-retreat-gallery.js
 * 3. Follow the prompts to add images
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DATA_FILE = path.join(__dirname, '../data/retreat2025-images.json');

function loadExistingData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Creating new data file...');
    return { images: [] };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('✅ Data saved successfully!');
  } catch (error) {
    console.error('❌ Error saving data:', error.message);
  }
}

function getGoogleDriveImageUrl(shareUrl) {
  // Convert Google Drive share URL to direct image URL
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // To: https://drive.google.com/uc?export=view&id=FILE_ID
  
  const fileIdMatch = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
  }
  
  // If it's already a direct URL, return as is
  if (shareUrl.includes('uc?export=view')) {
    return shareUrl;
  }
  
  return shareUrl; // Return original if can't convert
}

function addImage(data) {
  return new Promise((resolve) => {
    rl.question('Enter image URL (Google Drive share link or direct URL): ', (url) => {
      if (!url.trim()) {
        resolve(false);
        return;
      }

      const directUrl = getGoogleDriveImageUrl(url.trim());
      
      rl.question('Enter image name/description (optional): ', (name) => {
        const imageData = {
          url: directUrl,
          name: name.trim() || `Retreat Photo ${data.images.length + 1}`,
          addedAt: new Date().toISOString()
        };

        data.images.push(imageData);
        console.log(`✅ Added image: ${imageData.name}`);
        resolve(true);
      });
    });
  });
}

async function main() {
  console.log('🖼️  Retreat 2025 Gallery Updater');
  console.log('=====================================\n');
  
  const data = loadExistingData();
  console.log(`Current images in gallery: ${data.images.length}\n`);

  if (data.images.length > 0) {
    console.log('Current images:');
    data.images.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.name} - ${img.url}`);
    });
    console.log('');
  }

  const choice = await new Promise((resolve) => {
    rl.question('What would you like to do?\n1. Add new images\n2. Clear all images\n3. Exit\n\nEnter choice (1-3): ', resolve);
  });

  switch (choice.trim()) {
    case '1':
      console.log('\n📸 Adding new images...');
      console.log('(Press Enter with empty input to finish)\n');
      
      let adding = true;
      while (adding) {
        adding = await addImage(data);
      }
      
      if (data.images.length > 0) {
        saveData(data);
        console.log(`\n✅ Gallery updated with ${data.images.length} images!`);
      } else {
        console.log('\n❌ No images were added.');
      }
      break;

    case '2':
      const confirm = await new Promise((resolve) => {
        rl.question(`Are you sure you want to clear all ${data.images.length} images? (y/N): `, resolve);
      });
      
      if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
        data.images = [];
        saveData(data);
        console.log('✅ All images cleared!');
      } else {
        console.log('❌ Operation cancelled.');
      }
      break;

    case '3':
      console.log('👋 Goodbye!');
      break;

    default:
      console.log('❌ Invalid choice. Please run the script again.');
  }

  rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

main().catch(console.error);
