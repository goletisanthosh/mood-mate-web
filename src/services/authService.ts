
import { User } from '../types';

const USERS_STORAGE_KEY = 'mood_mate_users';
const CURRENT_USER_KEY = 'mood_mate_current_user';

export class AuthService {
  static getUsers(): User[] {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  static register(userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(user => user.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    return { success: true, message: 'Registration successful', user: newUser };
  }

  static login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return { success: true, message: 'Login successful', user };
    }
    
    return { success: false, message: 'Invalid email or password' };
  }

  static logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
