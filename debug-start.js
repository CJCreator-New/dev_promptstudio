// Simple debug script to identify startup issues
console.log('🚀 Starting DevPrompt Studio...');

// Check for common issues
try {
  // Check if required directories exist
  const fs = require('fs');
  const path = require('path');
  
  const requiredDirs = [
    'src',
    'src/components',
    'src/services',
    'src/store',
    'src/utils'
  ];
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.error(`❌ Missing directory: ${dir}`);
    } else {
      console.log(`✅ Found directory: ${dir}`);
    }
  });
  
  // Check package.json
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`📦 Package: ${pkg.name} v${pkg.version}`);
  
  // Check for node_modules
  if (!fs.existsSync('node_modules')) {
    console.error('❌ node_modules not found. Run: npm install');
    process.exit(1);
  }
  
  console.log('✅ Basic checks passed. Starting dev server...');
  
  // Start the dev server
  const { spawn } = require('child_process');
  const child = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  child.on('error', (error) => {
    console.error('❌ Failed to start dev server:', error);
  });
  
} catch (error) {
  console.error('❌ Startup error:', error);
  process.exit(1);
}