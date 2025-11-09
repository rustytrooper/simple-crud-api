import 'dotenv/config';
import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { UserController } from './controllers/userController';
import { errorHandler } from './middleware/errorHAndler';
import { validateUUID } from './utils/validation';

const PORT = process.env.PORT || 4000;

class App {
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const { method, url } = req;
      console.log(`Worker ${process.pid} handling ${method} ${url}`);

      const urlParts = url?.split('/').filter((part) => part) || [];

      if (urlParts[0] === 'api' && urlParts[1] === 'users') {
        if (method === 'GET' && urlParts.length === 2) {
          await this.userController.getAllUsers(req, res);
        } else if (method === 'GET' && urlParts.length === 3) {
          const userId = urlParts[2];
          if (!validateUUID(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid user ID' }));
            return;
          }
          await this.userController.getUserById(req, res, userId);
        } else if (method === 'POST' && urlParts.length === 2) {
          await this.userController.createUser(req, res);
        } else if (method === 'PUT' && urlParts.length === 3) {
          const userId = urlParts[2];
          if (!validateUUID(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid user ID' }));
            return;
          }
          await this.userController.updateUser(req, res, userId);
        } else if (method === 'DELETE' && urlParts.length === 3) {
          const userId = urlParts[2];
          if (!validateUUID(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid user ID' }));
            return;
          }
          await this.userController.deleteUser(req, res, userId);
        } else {
          errorHandler(res, 404, 'Endpoint not found');
        }
      } else {
        errorHandler(res, 404, 'Endpoint not found');
      }
    } catch (error) {
      console.error('Server error:', error);
      errorHandler(res, 500, 'Internal server error');
    }
  }

  public start(): void {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(PORT, () => {
      console.log(`Worker ${process.pid} server running on port ${PORT}`);
    });

    server.on('error', (error: Error) => {
      console.error('Server error:', error);
    });
  }
}

const app = new App();
app.start();
