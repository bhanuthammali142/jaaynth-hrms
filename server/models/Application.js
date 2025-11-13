const db = require('../config/database');

class Application {
  static async create({ jobId, candidateName, candidateEmail, resumeUrl, answers, score }) {
    const result = await db.query(
      `INSERT INTO applications (job_id, candidate_name, candidate_email, resume_url, answers, score) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [jobId, candidateName, candidateEmail, resumeUrl, JSON.stringify(answers), score || 0]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT a.*, j.title as job_title, j.department as job_department
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT a.*, j.title as job_title, j.department as job_department
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.jobId) {
      query += ` AND a.job_id = $${paramIndex}`;
      params.push(filters.jobId);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (a.candidate_name ILIKE $${paramIndex} OR a.candidate_email ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.minScore) {
      query += ` AND a.score >= $${paramIndex}`;
      params.push(filters.minScore);
      paramIndex++;
    }

    query += ' ORDER BY a.created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const result = await db.query(query, params);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const result = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async updateScore(id, score) {
    const result = await db.query(
      'UPDATE applications SET score = $1 WHERE id = $2 RETURNING *',
      [score, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM applications WHERE id = $1', [id]);
  }

  static async getStats() {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE status = 'new') as new_applications,
        COUNT(*) FILTER (WHERE status = 'shortlisted') as shortlisted,
        COUNT(*) FILTER (WHERE status = 'interviewed') as interviewed,
        COUNT(*) FILTER (WHERE status = 'offered') as offered,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
      FROM applications
    `);
    return result.rows[0];
  }

  static async getByJobId(jobId) {
    const result = await db.query(
      'SELECT * FROM applications WHERE job_id = $1 ORDER BY created_at DESC',
      [jobId]
    );
    return result.rows;
  }
}

module.exports = Application;
