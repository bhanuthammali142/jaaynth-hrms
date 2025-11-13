const db = require('../config/database');

const createTables = async () => {
  try {
    // Enable UUID extension
    await db.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'hr')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on email
    await db.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');

    // Jobs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        form_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes on jobs
    await db.query('CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by)');

    // Applications table
    await db.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        candidate_name VARCHAR(255) NOT NULL,
        candidate_email VARCHAR(255) NOT NULL,
        resume_url VARCHAR(500),
        answers JSONB DEFAULT '{}'::jsonb,
        score INTEGER DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'new' 
          CHECK (status IN ('new', 'shortlisted', 'interviewed', 'rejected', 'offered')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes on applications
    await db.query('CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(candidate_email)');

    // Interviews table
    await db.query(`
      CREATE TABLE IF NOT EXISTS interviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        interviewer UUID REFERENCES users(id) ON DELETE SET NULL,
        scheduled_time TIMESTAMP NOT NULL,
        meeting_link VARCHAR(500),
        notes TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'scheduled' 
          CHECK (status IN ('scheduled', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes on interviews
    await db.query('CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON interviews(application_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_time ON interviews(scheduled_time)');

    // Offers table
    await db.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        position VARCHAR(255) NOT NULL,
        salary DECIMAL(12, 2) NOT NULL,
        offer_letter_url VARCHAR(500),
        status VARCHAR(20) NOT NULL DEFAULT 'sent' 
          CHECK (status IN ('sent', 'accepted', 'rejected')),
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes on offers
    await db.query('CREATE INDEX IF NOT EXISTS idx_offers_application_id ON offers(application_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status)');

    // Settings table for company configuration
    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        key VARCHAR(100) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

module.exports = { createTables };
