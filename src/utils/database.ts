import type { User } from '../models/user';

class Database {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
    console.log('Database initialized - shared across workers');
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  createUser(user: Omit<User, 'id'>): User {
    const id = require('uuid').v4();
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  updateUser(id: string, userData: Omit<User, 'id'>): User | undefined {
    if (!this.users.has(id)) {
      return undefined;
    }
    const updatedUser: User = { ...userData, id };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }
}

export const database = new Database();
