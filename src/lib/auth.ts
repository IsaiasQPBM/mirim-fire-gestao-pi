
import db from './database';
import { v4 as uuidv4 } from 'uuid';

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'inactive';
}

// Simple authentication service for SQLite
export class AuthService {
  // Create a default admin user if none exists
  static createDefaultAdmin() {
    const adminExists = db.prepare('SELECT id FROM profiles WHERE role = ? LIMIT 1').get('admin');
    
    if (!adminExists) {
      const adminId = uuidv4();
      const stmt = db.prepare(`
        INSERT INTO profiles (id, full_name, email, role, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      
      stmt.run(adminId, 'Administrador', 'admin@cbmepi.gov.br', 'admin', 'active');
      console.log('Default admin user created');
    }
  }

  // Simple login simulation
  static login(email: string, password: string): AuthUser | null {
    // For demo purposes, accept any password for existing users
    const user = db.prepare(`
      SELECT id, full_name, email, role, status 
      FROM profiles 
      WHERE email = ? AND status = 'active'
    `).get(email) as AuthUser | undefined;

    return user || null;
  }

  // Get user by ID
  static getUserById(id: string): AuthUser | null {
    const user = db.prepare(`
      SELECT id, full_name, email, role, status 
      FROM profiles 
      WHERE id = ? AND status = 'active'
    `).get(id) as AuthUser | undefined;

    return user || null;
  }

  // Get current user from localStorage (client-side simulation)
  static getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    
    return this.getUserById(userId);
  }

  // Set current user in localStorage
  static setCurrentUser(user: AuthUser) {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userName', user.full_name);
    localStorage.setItem('userRole', user.role);
  }

  // Logout
  static logout() {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  }
}

// Initialize default admin on startup
AuthService.createDefaultAdmin();
