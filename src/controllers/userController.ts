import { IncomingMessage, ServerResponse } from 'http';
import { database } from '../utils/database';
// import { User } from '../models/user';
import { errorHandler } from '../middleware/errorHAndler';

export class UserController {
  async getAllUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const users = database.getAllUsers();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } catch (error) {
      errorHandler(res, 500, 'Failed to get users');
    }
  }

  async getUserById(req: IncomingMessage, res: ServerResponse, userId: string): Promise<void> {
    try {
      const user = database.getUserById(userId);
      if (!user) {
        errorHandler(res, 404, 'User not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (error) {
      errorHandler(res, 500, 'Failed to get user');
    }
  }

  async createUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const body = await this.parseRequestBody(req);
      const userData = JSON.parse(body);
      console.log(userData);
      if (!userData.username || !userData.age || !Array.isArray(userData.hobbies)) {
        errorHandler(res, 400, 'Missing required fields: username, age, hobbies');
        return;
      }
      const newUser = database.createUser({
        username: userData.username,
        age: userData.age,
        hobbies: userData.hobbies || [],
      });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    } catch (error) {
      // errorHandler(res, 400, 'Invalid JSON body');
      errorHandler(res, 400, `${error}`);
    }
  }

  async updateUser(req: IncomingMessage, res: ServerResponse, userId: string): Promise<void> {
    try {
      const body = await this.parseRequestBody(req);
      const userData = JSON.parse(body);

      if (!userData.username || !userData.age || !Array.isArray(userData.hobbies)) {
        errorHandler(res, 400, 'Missing required fields: username, age, hobbies');
        return;
      }

      const updatedUser = database.updateUser(userId, {
        username: userData.username,
        age: userData.age,
        hobbies: userData.hobbies || [],
      });

      if (!updatedUser) {
        errorHandler(res, 404, 'User not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    } catch (error) {
      errorHandler(res, 400, 'Invalid JSON body');
    }
  }

  async deleteUser(req: IncomingMessage, res: ServerResponse, userId: string): Promise<void> {
    try {
      const deleted = database.deleteUser(userId);
      if (!deleted) {
        errorHandler(res, 404, 'User not found');
        return;
      }
      res.writeHead(204);
      res.end();
    } catch (error) {
      errorHandler(res, 500, 'Failed to delete user');
    }
  }

  private parseRequestBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
      req.on('error', reject);
    });
  }
}
