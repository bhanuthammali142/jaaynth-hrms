const db = require('../config/database');

class Job {
  static async create({ title, department, description, formSchema, createdBy }) {
    const result = await db.query(
      'INSERT INTO jobs (title, department, description, form_schema, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, department, description, JSON.stringify(formSchema), createdBy]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT j.*, u.name as created_by_name, u.email as created_by_email 
       FROM jobs j 
       LEFT JOIN users u ON j.created_by = u.id 
       WHERE j.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT j.*, u.name as created_by_name,
             (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applications_count
      FROM jobs j
      LEFT JOIN users u ON j.created_by = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND j.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.department) {
      query += ` AND j.department ILIKE $${paramIndex}`;
      params.push(`%${filters.department}%`);
      paramIndex++;
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async update(id, { title, department, description, formSchema, status }) {
    const result = await db.query(
      `UPDATE jobs 
       SET title = $1, department = $2, description = $3, form_schema = $4, status = $5 
       WHERE id = $6 RETURNING *`,
      [title, department, description, JSON.stringify(formSchema), status, id]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await db.query(
      'UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM jobs WHERE id = $1', [id]);
  }

  static async getStats() {
    const result = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'active') as active_jobs,
        COUNT(*) FILTER (WHERE status = 'closed') as closed_jobs,
        COUNT(*) as total_jobs
      FROM jobs
    `);
    return result.rows[0];
  }
}

module.exports = Job;
