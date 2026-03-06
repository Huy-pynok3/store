#!/usr/bin/env node

/**
 * Check environment variables before deployment
 * Usage: node scripts/check-env.js
 */

const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV',
  'FRONTEND_URL',
];

const optionalVars = [
  'REDIS_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'TURNSTILE_SITE_KEY',
  'TURNSTILE_SECRET_KEY',
];

console.log('\n🔍 Checking Environment Variables\n');
console.log('='.repeat(60));

let hasErrors = false;

// Check required variables
console.log('\n✅ Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ❌ ${varName}: MISSING`);
    hasErrors = true;
  } else {
    const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD')
      ? '***' + value.slice(-4)
      : value.length > 50
      ? value.slice(0, 47) + '...'
      : value;
    console.log(`  ✓ ${varName}: ${displayValue}`);
  }
});

// Check optional variables
console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD')
      ? '***' + value.slice(-4)
      : value.length > 50
      ? value.slice(0, 47) + '...'
      : value;
    console.log(`  ✓ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ⚠ ${varName}: not set`);
  }
});

// Validate specific formats
console.log('\n🔎 Validating Formats:');

// Check DATABASE_URL format
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
    console.log('  ✓ DATABASE_URL: Valid PostgreSQL format');
  } else {
    console.log('  ❌ DATABASE_URL: Invalid format (should start with postgresql://)');
    hasErrors = true;
  }
}

// Check JWT_SECRET length
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret) {
  if (jwtSecret.length >= 32) {
    console.log(`  ✓ JWT_SECRET: Sufficient length (${jwtSecret.length} chars)`);
  } else {
    console.log(`  ⚠ JWT_SECRET: Too short (${jwtSecret.length} chars, recommended: 32+)`);
  }
}

// Check NODE_ENV
const nodeEnv = process.env.NODE_ENV;
if (nodeEnv) {
  if (['development', 'production', 'test'].includes(nodeEnv)) {
    console.log(`  ✓ NODE_ENV: ${nodeEnv}`);
  } else {
    console.log(`  ⚠ NODE_ENV: Unusual value "${nodeEnv}"`);
  }
}

// Check FRONTEND_URL format
const frontendUrl = process.env.FRONTEND_URL;
if (frontendUrl) {
  if (frontendUrl.startsWith('http://') || frontendUrl.startsWith('https://')) {
    console.log('  ✓ FRONTEND_URL: Valid URL format');
  } else {
    console.log('  ⚠ FRONTEND_URL: Should start with http:// or https://');
  }
}

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('\n❌ Environment check failed! Fix the errors above.\n');
  process.exit(1);
} else {
  console.log('\n✅ Environment check passed! Ready to deploy.\n');
  process.exit(0);
}
