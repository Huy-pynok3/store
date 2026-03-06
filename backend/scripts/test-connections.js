#!/usr/bin/env node

/**
 * Test database and Redis connections
 * Usage: node scripts/test-connections.js
 */

require('dotenv').config();

async function testPostgreSQL() {
  console.log('\n🔍 Testing PostgreSQL Connection...');
  
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL: Connected successfully');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('   Version:', result[0].version.split(' ').slice(0, 2).join(' '));
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL: Connection failed');
    console.log('   Error:', error.message);
    return false;
  }
}

async function testRedis() {
  console.log('\n🔍 Testing Redis Connection...');
  
  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    console.log('⚠️  Redis: Not configured (REDIS_URL not set)');
    console.log('   Set REDIS_URL in .env (e.g., redis://localhost:6379)');
    return null;
  }
  
  try {
    const { createClient } = require('redis');
    const client = createClient({
      url: redisUrl,
    });
    
    await client.connect();
    console.log('✅ Redis: Connected successfully');
    
    // Test ping
    const pong = await client.ping();
    console.log('   Ping:', pong);
    
    // Test set/get
    await client.set('test:connection', 'ok', { EX: 10 });
    const value = await client.get('test:connection');
    console.log('   Set/Get:', value === 'ok' ? 'OK' : 'Failed');
    
    await client.disconnect();
    return true;
  } catch (error) {
    console.log('❌ Redis: Connection failed');
    console.log('   Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n🚀 Testing Connections');
  console.log('='.repeat(60));
  
  const pgResult = await testPostgreSQL();
  const redisResult = await testRedis();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`  PostgreSQL: ${pgResult ? '✅ OK' : '❌ Failed'}`);
  console.log(`  Redis: ${redisResult === null ? '⚠️  Not configured' : redisResult ? '✅ OK' : '❌ Failed'}`);
  
  if (!pgResult) {
    console.log('\n❌ Critical: PostgreSQL connection failed!');
    console.log('   Check your DATABASE_URL environment variable.');
    process.exit(1);
  }
  
  if (redisResult === false) {
    console.log('\n⚠️  Warning: Redis connection failed!');
    console.log('   App will work but without caching and queue features.');
  }
  
  console.log('\n✅ Connection test completed!\n');
  process.exit(0);
}

main().catch(error => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});
