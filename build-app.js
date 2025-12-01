// Simple build script for creating a standalone app
const fs = require('fs');
const path = require('path');

// Update package.json for app mode
const packagePath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add app-specific scripts
pkg.scripts = {
  ...pkg.scripts,
  'build:app': 'vite build --mode app',
  'preview:app': 'vite preview --mode app'
};

// Add app metadata
pkg.app = {
  name: 'DevPrompt Studio',
  description: 'AI-Powered Prompt Enhancement Tool',
  version: pkg.version,
  trial: {
    limit: 3,
    features: ['prompt_enhancement', 'history', 'templates']
  }
};

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

console.log('✅ App build configuration updated');
console.log('📦 Run: npm run build:app');
console.log('🚀 Preview: npm run preview:app');