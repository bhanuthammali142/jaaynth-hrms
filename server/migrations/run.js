const { createTables } = require('./createTables');
const db = require('../config/database');

const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...');
    await createTables();
    console.log('✅ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
