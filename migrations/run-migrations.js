#!/usr/bin/env node

/**
 * Supabase Migration Runner (Node.js)
 * 
 * Displays migration files in order for easy copying to Supabase SQL Editor
 * 
 * Usage:
 *   node migrations/run-migrations.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MIGRATIONS_DIR = path.join(__dirname);
const MIGRATION_FILES = [
  '001_extensions.sql',
  '002_users_table.sql',
  '003_user_languages_table.sql',
  '004_user_interests_table.sql',
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function displayMigrations() {
  console.log('\n🚀 TaalMeet Database Migration Runner\n');
  console.log('=====================================\n');
  console.log('This script will help you run migrations in Supabase SQL Editor\n');
  console.log('📋 Steps:');
  console.log('1. Go to your Supabase Dashboard');
  console.log('2. Click "SQL Editor" in the left sidebar');
  console.log('3. Click "New query"');
  console.log('4. Copy and paste each migration below');
  console.log('5. Click "Run" after each migration\n');
  
  await question('Press Enter to continue...\n');

  for (const file of MIGRATION_FILES) {
    const filepath = path.join(MIGRATIONS_DIR, file);
    
    if (!fs.existsSync(filepath)) {
      console.log(`❌ Error: ${filepath} not found\n`);
      continue;
    }
    
    const content = fs.readFileSync(filepath, 'utf8');
    
    console.log('\n' + '━'.repeat(70));
    console.log(`📄 Migration: ${file}`);
    console.log('━'.repeat(70) + '\n');
    console.log(content);
    console.log('\n' + '━'.repeat(70));
    console.log('\n✅ Copy the SQL above and run it in Supabase SQL Editor\n');
    
    if (file !== MIGRATION_FILES[MIGRATION_FILES.length - 1]) {
      await question('Press Enter to continue to next migration...\n');
    }
  }

  console.log('\n✅ All migrations displayed!\n');
  console.log('📝 Next steps:');
  console.log('1. Verify all migrations ran successfully');
  console.log('2. Check Table Editor to see your tables');
  console.log('3. Check Database > Extensions to verify PostGIS is enabled\n');
  
  rl.close();
}

displayMigrations().catch((error) => {
  console.error('❌ Error:', error.message);
  rl.close();
  process.exit(1);
});

