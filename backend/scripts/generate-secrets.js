#!/usr/bin/env node

/**
 * Generate secure secrets for deployment
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating Secure Secrets for Deployment\n');
console.log('=' .repeat(60));

// Generate JWT Secret (32 bytes = 64 hex chars)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('\n📝 JWT_SECRET:');
console.log(jwtSecret);

// Generate Session Secret (32 bytes)
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('\n📝 SESSION_SECRET:');
console.log(sessionSecret);

// Generate API Key (16 bytes = 32 hex chars)
const apiKey = crypto.randomBytes(16).toString('hex');
console.log('\n📝 API_KEY (for internal services):');
console.log(apiKey);

console.log('\n' + '='.repeat(60));
console.log('\n✅ Copy these values to your Render Environment Variables');
console.log('⚠️  Never commit these secrets to Git!\n');
