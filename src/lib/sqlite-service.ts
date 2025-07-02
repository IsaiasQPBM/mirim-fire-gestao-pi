
import db from './database';
import { v4 as uuidv4 } from 'uuid';

// Generic SQLite service for CRUD operations
export class SQLiteService {
  
  // Generic insert
  static insert(table: string, data: Record<string, any>): string {
    const id = uuidv4();
    const columns = ['id', ...Object.keys(data)];
    const placeholders = columns.map(() => '?').join(', ');
    const values = [id, ...Object.values(data)];
    
    const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`);
    stmt.run(...values);
    
    return id;
  }

  // Generic select
  static select(table: string, where?: Record<string, any>, orderBy?: string): any[] {
    let query = `SELECT * FROM ${table}`;
    let params: any[] = [];
    
    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
      query += ` WHERE ${conditions}`;
      params = Object.values(where);
    }
    
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }
    
    return db.prepare(query).all(...params);
  }

  // Generic select by ID
  static selectById(table: string, id: string): any | null {
    const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
    return stmt.get(id);
  }

  // Generic update
  static update(table: string, id: string, data: Record<string, any>): boolean {
    const columns = Object.keys(data);
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    const values = [...Object.values(data), id];
    
    const stmt = db.prepare(`UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    const result = stmt.run(...values);
    
    return result.changes > 0;
  }

  // Generic delete
  static delete(table: string, id: string): boolean {
    const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    const result = stmt.run(id);
    
    return result.changes > 0;
  }

  // Count records
  static count(table: string, where?: Record<string, any>): number {
    let query = `SELECT COUNT(*) as count FROM ${table}`;
    let params: any[] = [];
    
    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
      query += ` WHERE ${conditions}`;
      params = Object.values(where);
    }
    
    const result = db.prepare(query).get(...params) as { count: number };
    return result.count;
  }

  // Execute custom query
  static query(sql: string, params: any[] = []): any[] {
    return db.prepare(sql).all(...params);
  }

  // Execute custom query (single result)
  static queryOne(sql: string, params: any[] = []): any | null {
    return db.prepare(sql).get(...params);
  }
}
