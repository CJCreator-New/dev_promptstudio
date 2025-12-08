#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const reportPath = path.join(process.cwd(), '.a11y', 'audit-report.json');

if (!fs.existsSync(reportPath)) {
  console.error('No audit report found. Run: npm run a11y:audit');
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

console.log('\n📊 Accessibility Audit Report\n');
console.log('═'.repeat(60));

results.forEach(({ url, issues }) => {
  console.log(`\n🔗 ${url}`);
  console.log('─'.repeat(60));
  
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  const notices = issues.filter(i => i.type === 'notice');
  
  console.log(`\n  Errors:   ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log(`  Notices:  ${notices.length}`);
  
  if (errors.length > 0) {
    console.log('\n  ❌ Errors:');
    errors.slice(0, 5).forEach(issue => {
      console.log(`    • ${issue.message}`);
      console.log(`      ${issue.selector}`);
      console.log(`      Code: ${issue.code}\n`);
    });
    if (errors.length > 5) {
      console.log(`    ... and ${errors.length - 5} more errors\n`);
    }
  }
  
  if (warnings.length > 0) {
    console.log('\n  ⚠ Warnings:');
    warnings.slice(0, 3).forEach(issue => {
      console.log(`    • ${issue.message}`);
      console.log(`      ${issue.selector}\n`);
    });
    if (warnings.length > 3) {
      console.log(`    ... and ${warnings.length - 3} more warnings\n`);
    }
  }
});

console.log('\n═'.repeat(60));
console.log('\n💡 Tips:');
console.log('  • Fix errors first (WCAG violations)');
console.log('  • Review warnings for best practices');
console.log('  • Run: npm run a11y:test for detailed tests\n');
