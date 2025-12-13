#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying project cleanup...\n');

const checks = [
  {
    name: 'Duplicate directories removed',
    paths: ['components', 'hooks', 'services', 'utils'],
    shouldNotExist: true
  },
  {
    name: 'Test artifacts removed',
    paths: ['test-results', 'playwright-report', '.a11y'],
    shouldNotExist: true
  },
  {
    name: 'Source directory exists',
    paths: ['src/components', 'src/hooks', 'src/services', 'src/utils'],
    shouldNotExist: false
  },
  {
    name: 'Config files exist',
    paths: ['package.json', 'tsconfig.json', 'vite.config.ts', 'playwright.config.ts'],
    shouldNotExist: false
  }
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  console.log(`\n📋 ${check.name}`);
  
  check.paths.forEach(p => {
    const fullPath = path.join(process.cwd(), p);
    const exists = fs.existsSync(fullPath);
    const expected = !check.shouldNotExist;
    const pass = exists === expected;
    
    if (pass) {
      console.log(`  ✅ ${p}`);
      passed++;
    } else {
      console.log(`  ❌ ${p} ${exists ? 'exists' : 'missing'}`);
      failed++;
    }
  });
});

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n✅ All checks passed! Project is clean.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Review the output above.\n');
  process.exit(1);
}
