// scripts/setup-uploads.js
// Run this with: node scripts/setup-uploads.js

import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const uploadDir = join(process.cwd(), 'public', 'uploads', 'templates');

console.log('Setting up upload directories...');
console.log('Target directory:', uploadDir);

try {
  // Create directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Upload directory created successfully');
  } else {
    console.log('✅ Upload directory already exists');
  }

  // Create .gitkeep to preserve directory in git
  const gitkeepPath = join(uploadDir, '.gitkeep');
  if (!existsSync(gitkeepPath)) {
    writeFileSync(gitkeepPath, '');
    console.log('✅ .gitkeep file created');
  }

  // Test write permissions
  const testFile = join(uploadDir, 'test.txt');
  writeFileSync(testFile, 'test');
  unlinkSync(testFile);
  console.log('✅ Directory is writable');

  console.log('\n🎉 Setup complete! You can now upload files.');
} catch (error) {
  console.error('❌ Error setting up upload directory:', error.message);
  process.exit(1);
}