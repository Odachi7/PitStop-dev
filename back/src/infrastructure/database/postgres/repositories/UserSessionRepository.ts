import { Pool } from 'pg';
import { UserSession } from '../../../../core/entities/UserSession';
import { IUserSessionRepository } from '../../../../core/repositories/IUserSessionRepository';

export class UserSessionRepository implements IUserSessionRepository {
  constructor(private pool: Pool) {}

  async findById(id: string): Promise<UserSession | null> {
    const query = `
      SELECT s.*, u.*, c.database_name, c.subscription_plan
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON u.company_id = c.id
      WHERE s.id = $1
    `;
    
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return UserSession.create({
      userId: row.user_id,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at,
      createdAt: row.created_at
    }, row.id);
  }

  async findByTokenHash(tokenHash: string): Promise<UserSession | null> {
    const query = `
      SELECT s.*, u.*, c.database_name, c.subscription_plan
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON u.company_id = c.id
      WHERE s.token_hash = $1 AND s.expires_at > NOW()
    `;
    
    const result = await this.pool.query(query, [tokenHash]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return UserSession.create({
      userId: row.user_id,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at,
      createdAt: row.created_at
    }, row.id);
  }

  async findByUserId(userId: string): Promise<UserSession[]> {
    const query = `
      SELECT s.*, u.*, c.database_name, c.subscription_plan
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON u.company_id = c.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
    `;
    
    const result = await this.pool.query(query, [userId]);
    
    return result.rows.map(row => UserSession.create({
      userId: row.user_id,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at,
      createdAt: row.created_at
    }, row.id));
  }

  async create(session: UserSession): Promise<UserSession> {
    const query = `
      INSERT INTO user_sessions (
        id, user_id, token_hash, expires_at, created_at
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      session.id,
      session.userId,
      session.tokenHash,
      session.expiresAt,
      session.createdAt || new Date()
    ];

    const result = await this.pool.query(query, values);
    return session;
  }

  async update(session: UserSession): Promise<UserSession> {
    const query = `
      UPDATE user_sessions SET
        user_id = $2,
        token_hash = $3,
        expires_at = $4
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [
      session.id,
      session.userId,
      session.tokenHash,
      session.expiresAt
    ];

    await this.pool.query(query, values);
    return session;
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM user_sessions WHERE id = $1`;
    await this.pool.query(query, [id]);
  }

  async deleteByUserId(userId: string): Promise<void> {
    const query = `DELETE FROM user_sessions WHERE user_id = $1`;
    await this.pool.query(query, [userId]);
  }

  async deleteExpired(): Promise<void> {
    const query = `DELETE FROM user_sessions WHERE expires_at < NOW()`;
    await this.pool.query(query);
  }

  async cleanExpiredSessions(): Promise<void> {
    await this.deleteExpired();
  }
}
