const db = require('../config/database');

class Interview {
  static async create({ applicationId, interviewer, scheduledTime, meetingLink, notes }) {
    const result = await db.query(
      `INSERT INTO interviews (application_id, interviewer, scheduled_time, meeting_link, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [applicationId, interviewer, scheduledTime, meetingLink, notes]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT i.*, 
              a.candidate_name, a.candidate_email,
              j.title as job_title,
              u.name as interviewer_name
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON i.interviewer = u.id
       WHERE i.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT i.*, 
             a.candidate_name, a.candidate_email,
             j.title as job_title,
             u.name as interviewer_name
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN jobs j ON a.job_id = j.id
      LEFT JOIN users u ON i.interviewer = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND i.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.interviewer) {
      query += ` AND i.interviewer = $${paramIndex}`;
      params.push(filters.interviewer);
      paramIndex++;
    }

    if (filters.startDate) {
      query += ` AND i.scheduled_time >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND i.scheduled_time <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    query += ' ORDER BY i.scheduled_time ASC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async update(id, { scheduledTime, meetingLink, notes, status }) {
    const result = await db.query(
      `UPDATE interviews 
       SET scheduled_time = $1, meeting_link = $2, notes = $3, status = $4 
       WHERE id = $5 RETURNING *`,
      [scheduledTime, meetingLink, notes, status, id]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await db.query(
      'UPDATE interviews SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM interviews WHERE id = $1', [id]);
  }

  static async getStats() {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_interviews,
        COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
      FROM interviews
    `);
    return result.rows[0];
  }

  static async getByApplicationId(applicationId) {
    const result = await db.query(
      `SELECT i.*, u.name as interviewer_name
       FROM interviews i
       LEFT JOIN users u ON i.interviewer = u.id
       WHERE i.application_id = $1
       ORDER BY i.scheduled_time DESC`,
      [applicationId]
    );
    return result.rows;
  }
}

module.exports = Interview;
