#!/usr/bin/env node

/**
 * Image Pixelation Script
 * 
 * This script processes judge images with a pixelation effect inspired by p5.js
 * and saves them to the public directory for use in the judges component.
 */

const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { execSync } = require('node:child_process');

// Configuration
const sourceDir = path.join(__dirname, '../public/images/judges');
const targetDir = path.join(__dirname, '../public/images/judges-dithered');
const defaultImage = path.join(__dirname, '../public/images/judges/placeholder.jpg');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Install sharp if not already installed
try {
  require.resolve('sharp');
  console.log('Sharp is already installed');
} catch (e) {
  console.log('Installing sharp...');
  execSync('bun add sharp', { stdio: 'inherit' });
}

/**
 * Apply 3D pixelation effect to an image, inspired by the p5.js example
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to save pixelated image
 * @param {Object} options - Pixelation options
 */
async function pixelateImage(inputPath, outputPath, options = {}) {
  const {
    pixelSize = 10,     // Size of each pixel block
    grayscale = false,  // Whether to convert to grayscale
    contrast = 1.4,     // Contrast adjustment
    circle = true,      // Whether to apply circular mask
    dark = false,       // Whether to make the image darker
    depth = 0.5,        // Depth effect intensity (0-1)
    showGrid = true     // Whether to show grid lines
  } = options;

  try {
    // Read the input image
    const inputBuffer = fs.readFileSync(inputPath);
    
    // Start with the base image processing pipeline
    let pipeline = sharp(inputBuffer);
    
    // Resize to a smaller size first (this creates the pixelation effect when enlarged)
    const targetSize = 500; // Final image size
    const smallSize = Math.floor(targetSize / pixelSize); // Small size for pixelation
    
    // Apply initial processing
    pipeline = pipeline
      .resize(smallSize, smallSize, { fit: 'cover', position: 'center' })
      .modulate({ brightness: dark ? 0.8 : 1.0, saturation: 0.9 }) // Adjust brightness and saturation
      .sharpen(); // Enhance edges
    
    // Apply grayscale if requested
    if (grayscale) {
      pipeline = pipeline.grayscale();
    }
    
    // Increase contrast to make the 3D effect more pronounced
    pipeline = pipeline.linear(
      contrast, // Multiply by this
      -(contrast - 1) * 128 // Subtract this (to maintain average brightness)
    );
    
    // Get the processed image data for 3D effect calculation
    const processedImageBuffer = await pipeline.toBuffer();
    
    // Create a new image with the 3D pixel effect
    const pixelatedImage = await create3DPixelEffect(
      processedImageBuffer, 
      smallSize, 
      targetSize, 
      pixelSize,
      depth,
      showGrid
    );
    
    // Start a new pipeline with the 3D pixelated image
    pipeline = sharp(pixelatedImage);
    
    // Apply circular mask if requested
    if (circle) {
      const circleBuffer = await createCircleMask(targetSize);
      pipeline = pipeline.composite([{ input: circleBuffer, blend: 'dest-in' }]);
    }
    
    // Save the processed image
    await pipeline.toFile(outputPath);
    console.log(`Processed: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

/**
 * Create a 3D pixel effect similar to the p5.js example
 * @param {Buffer} inputBuffer - Input image buffer
 * @param {number} smallSize - Size of the small pixelated image
 * @param {number} targetSize - Size of the output image
 * @param {number} pixelSize - Size of each pixel
 * @param {number} depthFactor - Intensity of the 3D effect (0-1)
 * @param {boolean} showGrid - Whether to show grid lines
 * @returns {Promise<Buffer>} - Buffer containing the 3D pixelated image
 */
async function create3DPixelEffect(inputBuffer, smallSize, targetSize, pixelSize, depthFactor = 0.5, showGrid = true) {
  // Create a new sharp instance with the input buffer
  const inputImage = sharp(inputBuffer);
  
  // Get metadata and raw pixel data
  const metadata = await inputImage.metadata();
  const { data, info } = await inputImage.raw().toBuffer({ resolveWithObject: true });
  
  // Calculate pixel size in the target image
  const scaleFactor = targetSize / smallSize;
  const pixelWidth = Math.ceil(scaleFactor);
  
  // Create a new SVG for the 3D pixel effect
  let svg = `<svg width="${targetSize}" height="${targetSize}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
`;
  
  // Add a black background
  svg += `<rect width="${targetSize}" height="${targetSize}" fill="#000000" />
`;
  
  // Define a drop shadow filter for 3D effect
  svg += `
  <defs>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
      <feOffset dx="2" dy="2" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
`;
  
  // Process each pixel in the small image
  for (let y = 0; y < smallSize; y++) {
    for (let x = 0; x < smallSize; x++) {
      // Calculate the index in the raw data
      const idx = (y * smallSize + x) * info.channels;
      
      // Get RGB values
      const r = data[idx] || 0;
      const g = data[idx + 1] || 0;
      const b = data[idx + 2] || 0;
      
      // Calculate brightness (0-1)
      const brightness = (r + g + b) / (3 * 255);
      
      // Calculate the z-height based on brightness
      // Darker pixels are taller (like in the p5.js example)
      const height = Math.round((1 - brightness) * 50 * depthFactor);
      
      // Calculate position in the target image
      const targetX = x * scaleFactor;
      const targetY = y * scaleFactor;
      
      // Convert RGB to hex
      const color = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
      
      // Create a 3D-like box for each pixel
      // Use different shades for top, left, and right faces
      const topColor = color;
      const leftColor = adjustBrightness(color, -0.3); // Darker for shadow
      const rightColor = adjustBrightness(color, 0.1); // Slightly lighter
      
      // Calculate perspective skew
      const skewFactor = 0.2 * depthFactor;
      
      // Add the 3D box to the SVG
      svg += `<g filter="url(#dropShadow)">
`;
      
      // Right face (lighter)
      svg += `<polygon points="
        ${targetX + pixelWidth},${targetY}
        ${targetX + pixelWidth},${targetY + pixelWidth}
        ${targetX + pixelWidth - height * skewFactor},${targetY + pixelWidth - height}
        ${targetX + pixelWidth - height * skewFactor},${targetY - height}
      " fill="${rightColor}" />
`;
      
      // Left face (darker)
      svg += `<polygon points="
        ${targetX},${targetY}
        ${targetX},${targetY + pixelWidth}
        ${targetX - height * skewFactor},${targetY + pixelWidth - height}
        ${targetX - height * skewFactor},${targetY - height}
      " fill="${leftColor}" />
`;
      
      // Top face
      svg += `<polygon points="
        ${targetX},${targetY}
        ${targetX + pixelWidth},${targetY}
        ${targetX + pixelWidth - height * skewFactor},${targetY - height}
        ${targetX - height * skewFactor},${targetY - height}
      " fill="${topColor}" />
`;
      
      svg += `</g>
`;
    }
  }
  
  // Add grid lines if requested
  if (showGrid) {
    svg += `<g opacity="0.3">
`;
    
    // Horizontal grid lines
    for (let y = 0; y <= smallSize; y++) {
      const targetY = y * scaleFactor;
      svg += `<line x1="0" y1="${targetY}" x2="${targetSize}" y2="${targetY}" stroke="#ffffff" stroke-width="0.5" />
`;
    }
    
    // Vertical grid lines
    for (let x = 0; x <= smallSize; x++) {
      const targetX = x * scaleFactor;
      svg += `<line x1="${targetX}" y1="0" x2="${targetX}" y2="${targetSize}" stroke="#ffffff" stroke-width="0.5" />
`;
    }
    
    svg += `</g>
`;
  }
  
  svg += `</svg>`;
  
  // Convert SVG to PNG
  return await sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * Adjust the brightness of a hex color
 * @param {string} hex - Hex color code
 * @param {number} factor - Brightness adjustment factor (-1 to 1)
 * @returns {string} - Adjusted hex color
 */
function adjustBrightness(hex, factor) {
  // Parse the hex color
  const r = Number.parseInt(hex.substring(1, 3), 16);
  const g = Number.parseInt(hex.substring(3, 5), 16);
  const b = Number.parseInt(hex.substring(5, 7), 16);
  
  // Adjust brightness
  const adjust = (value) => {
    const adjusted = Math.round(value * (1 + factor));
    return Math.max(0, Math.min(255, adjusted));
  };
  
  // Convert back to hex
  const rHex = adjust(r).toString(16).padStart(2, '0');
  const gHex = adjust(g).toString(16).padStart(2, '0');
  const bHex = adjust(b).toString(16).padStart(2, '0');
  
  return `#${rHex}${gHex}${bHex}`;
}

/**
 * Create a circular mask for the image
 * @param {number} size - Size of the mask
 * @returns {Promise<Buffer>} - Buffer containing the mask image
 */
async function createCircleMask(size) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2;
  
  // Create an SVG circle
  const svg = `
    <svg width="${size}" height="${size}">
      <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="white" />
    </svg>
  `;
  
  // Convert SVG to PNG buffer
  return await sharp(Buffer.from(svg)).toBuffer();
}

/**
 * Create a grid pattern overlay for the pixelated effect
 * @param {number} size - Size of the grid
 * @param {number} cellSize - Size of each grid cell
 * @returns {Promise<Buffer>} - Buffer containing the grid image
 */
async function createGridOverlay(size, cellSize) {
  // Create an SVG with a grid pattern
  let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Add horizontal and vertical lines
  for (let i = 0; i <= size; i += cellSize) {
    // Horizontal line
    svg += `<line x1="0" y1="${i}" x2="${size}" y2="${i}" stroke="rgba(0,0,0,0.2)" stroke-width="1" />`;
    // Vertical line
    svg += `<line x1="${i}" y1="0" x2="${i}" y2="${size}" stroke="rgba(0,0,0,0.2)" stroke-width="1" />`;
  }
  
  svg += '</svg>';
  
  // Convert SVG to PNG buffer
  return await sharp(Buffer.from(svg)).toBuffer();
}

/**
 * Process all images in the source directory
 */
async function processAllImages() {
  // Create a placeholder if it doesn't exist
  if (!fs.existsSync(defaultImage)) {
    console.log('Creating placeholder image...');
    await sharp({
      create: {
        width: 500,
        height: 500,
        channels: 4,
        background: { r: 50, g: 50, b: 50, alpha: 1 }
      }
    }).toFile(defaultImage);
  }

  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory ${sourceDir} does not exist. Creating it...`);
    fs.mkdirSync(sourceDir, { recursive: true });
    
    // Copy placeholder to source dir
    await sharp(defaultImage).toFile(path.join(sourceDir, 'placeholder.jpg'));
  }

  // Get all images from source directory
  let files;
  try {
    files = fs.readdirSync(sourceDir);
  } catch (error) {
    console.error(`Error reading source directory: ${error.message}`);
    return;
  }

  // Filter for image files
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  if (imageFiles.length === 0) {
    console.log('No image files found in source directory.');
    
    // Create a placeholder image in the target directory
    await pixelateImage(defaultImage, path.join(targetDir, 'placeholder.png'), {
      grayscale: true,
      pixelSize: 12,
      depth: 0.6,
      showGrid: true
    });
    return;
  }

  // Process each image
  const promises = imageFiles.map(async (file) => {
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(
      targetDir, 
      `${path.basename(file, path.extname(file))}.png` // Changed to PNG for better quality
    );
    
    // Apply pixelation with different settings based on filename
    const options = {
      pixelSize: file.includes('large') ? 20 : file.includes('medium') ? 12 : 8,
      grayscale: file.includes('bw') || file.includes('gray'),
      contrast: file.includes('high-contrast') ? 1.5 : 1.2,
      dark: file.includes('dark'),
      circle: !file.includes('square'),
      depth: file.includes('flat') ? 0.2 : file.includes('deep') ? 0.8 : 0.5,
      showGrid: !file.includes('no-grid')
    };
    
    await pixelateImage(inputPath, outputPath, options);
  });

  await Promise.all(promises);
  console.log('All images processed successfully!');
}

// Run the script
processAllImages().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});

// Export functions for potential reuse
module.exports = {
  pixelateImage,
  createCircleMask,
  createGridOverlay
};
