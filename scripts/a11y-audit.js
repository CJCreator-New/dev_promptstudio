#!/usr/bin/env node
import pa11y from 'pa11y';
import fs from 'fs';
import path from 'path';

const urls = [
  'http://localhost:3000',
  'http://localhost:3000/?share=test'
];

const options = {
  standard: 'WCAG2AA',
  runners: ['axe', 'htmlcs'],
  timeout: 30000,
  wait: 2000,
  chromeLaunchConfig: {
    args: ['--no-sandbox']
  }
};

async function runAudit() {
  console.log('🔍 Running accessibility audit...\n');
  
  const results = [];
  
  for (const url of urls) {
    console.log(`Testing: ${url}`);
    try {
      const result = await pa11y(url, options);
      results.push({ url, issues: result.issues });
      
      const errors = result.issues.filter(i => i.type === 'error');
      const warnings = result.issues.filter(i => i.type === 'warning');
      
      console.log(`  ✓ Errors: ${errors.length}`);
      console.log(`  ⚠ Warnings: ${warnings.length}\n`);
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}\n`);
    }
  }
  
  // Save report
  const reportDir = path.join(process.cwd(), '.a11y');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportPath = path.join(reportDir, 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  console.log(`📄 Report saved to: ${reportPath}`);
  
  // Exit with error if violations found
  const totalErrors = results.reduce((sum, r) => 
    sum + r.issues.filter(i => i.type === 'error').length, 0
  );
  
  if (totalErrors > 0) {
    console.error(`\n❌ Found ${totalErrors} accessibility errors`);
    process.exit(1);
  } else {
    console.log('\n✅ No accessibility errors found');
  }
}

runAudit().catch(console.error);
