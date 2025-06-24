import * as fs from 'fs';
import * as path from 'path';

// Set the source and destination paths
const sourceDir = path.resolve(__dirname, '../../../../backend/deployments');
const destDir = path.resolve(__dirname, '../../../../frontend/packages/nextjs/deployments');

// Function to copy the folder
function copyFolder(source: string, destination: string): void {
  // Ensure the destination directory exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read all files and folders in the source directory
  const files = fs.readdirSync(source);

  // Iterate over the files and copy them
  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // If the file is a directory, recursively copy
      copyFolder(sourcePath, destPath);
    } else {
      // If it's a file, copy it
      fs.copyFileSync(sourcePath, destPath);
    }
  });

  console.log(`Successfully copied from ${source} to ${destination}`);
}

// Run the function to copy the deployments
copyFolder(sourceDir, destDir);