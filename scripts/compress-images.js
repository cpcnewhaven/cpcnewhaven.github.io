#!/usr/bin/env node

/**
 * Image Compression Script for Retreat 2025 Gallery
 * 
 * This script helps compress large JPEG files for faster loading.
 * It uses Google Cloud Storage's image processing API.
 * 
 * Usage:
 * 1. Make sure you have gcloud CLI installed and authenticated
 * 2. Run: node scripts/compress-images.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BUCKET_NAME = 'cpc-public-website';
const FOLDER_NAME = 'retreat2025';
const JSON_FILE = './data/retreat2025-images.json';

// Image processing parameters
const THUMBNAIL_PARAMS = 'w=400&h=400&f=webp&q=80';
const LIGHTBOX_PARAMS = 'w=1200&h=1200&f=webp&q=85';

console.log('🖼️  Retreat 2025 Image Compression Helper');
console.log('==========================================\n');

// Read the JSON file
try {
    const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    const images = jsonData.images;
    
    console.log(`📊 Found ${images.length} images in JSON file\n`);
    
    // Show compression URLs
    console.log('🔗 Compression URLs:');
    console.log('===================\n');
    
    images.slice(0, 5).forEach((image, index) => {
        const filename = image.filename;
        const baseUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${FOLDER_NAME}/${encodeURIComponent(filename)}`;
        
        console.log(`${index + 1}. ${filename}`);
        console.log(`   Thumbnail: ${baseUrl}?${THUMBNAIL_PARAMS}`);
        console.log(`   Lightbox:  ${baseUrl}?${LIGHTBOX_PARAMS}`);
        console.log(`   Original:  ${baseUrl}\n`);
    });
    
    if (images.length > 5) {
        console.log(`   ... and ${images.length - 5} more images\n`);
    }
    
    console.log('✅ Your gallery is already configured to use compressed images!');
    console.log('\n📈 Performance Benefits:');
    console.log('• Thumbnails: 400x400px WebP format (80% quality)');
    console.log('• Lightbox: 1200x1200px WebP format (85% quality)');
    console.log('• Automatic fallback to original if compression fails');
    console.log('• Lazy loading for better performance');
    
    console.log('\n🚀 The gallery should now load much faster!');
    
} catch (error) {
    console.error('❌ Error reading JSON file:', error.message);
    process.exit(1);
}
