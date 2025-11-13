const db = require('../config/database');

class Offer {
  static async create({ applicationId, position, salary, offerLetterUrl }) {
    const result = await db.query(
      `INSERT INTO offers (application_id, position, salary, offer_letter_url) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [applicationId, position, salary, offerLetterUrl]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT o.*, 
              a.candidate_name, a.candidate_email,
              j.title as job_title
       FROM offers o
       JOIN applications a ON o.application_id = a.id
       JOIN jobs j ON a.job_id = j.id
       WHERE o.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT o.*, 
             a.candidate_name, a.candidate_email,
             j.title as job_title
      FROM offers o
      JOIN applications a ON o.application_id = a.id
      JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND o.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    query += ' ORDER BY o.sent_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const result = await db.query(
      'UPDATE offers SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async update(id, { position, salary, offerLetterUrl }) {
    const result = await db.query(
      `UPDATE offers 
       SET position = $1, salary = $2, offer_letter_url = $3 
       WHERE id = $4 RETURNING *`,
      [position, salary, offerLetterUrl, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM offers WHERE id = $1', [id]);
  }

  static async getStats() {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_offers,
        COUNT(*) FILTER (WHERE status = 'sent') as sent,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
      FROM offers
    `);
    return result.rows[0];
  }

  static async getByApplicationId(applicationId) {
    const result = await db.query(
      'SELECT * FROM offers WHERE application_id = $1 ORDER BY sent_at DESC',
      [applicationId]
    );
    return result.rows;
  }
}

module.exports = Offer;
