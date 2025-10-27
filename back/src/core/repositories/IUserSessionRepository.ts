import { UserSession } from '../entities/UserSession';

export interface IUserSessionRepository {
  findById(id: string): Promise<UserSession | null>;
  findByTokenHash(tokenHash: string): Promise<UserSession | null>;
  findByUserId(userId: string): Promise<UserSession[]>;
  create(session: UserSession): Promise<UserSession>;
  update(session: UserSession): Promise<UserSession>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
  cleanExpiredSessions(): Promise<void>;
}
