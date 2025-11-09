import cluster from 'cluster';
import os from 'os';
import { spawn } from 'child_process';

const numCPUs = os.cpus().length;
const basePort = parseInt(process.env.PORT || '4000');
const workerCount = numCPUs > 1 ? numCPUs - 1 : 1;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Starting ${workerCount} workers`);

  const workers: { [key: number]: any } = {};

  for (let i = 0; i < workerCount; i++) {
    const workerPort = basePort + i + 1;
    const worker = cluster.fork({
      WORKER_PORT: workerPort.toString(),
      WORKER_ID: (i + 1).toString(),
    });

    workers[worker.id] = { port: workerPort };
  }

  let currentWorker = 0;
  const workerIds = Object.keys(workers);

  const http = require('http');
  const server = http.createServer((req: any, res: any) => {
    const workerId = workerIds[currentWorker];
    const workerPort = workers[parseInt(workerId!)].port;

    console.log(`Balancer: Routing request to worker ${workerId} on port ${workerPort}`);

    const options = {
      hostname: 'localhost',
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes: any) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err: Error) => {
      console.error('Proxy error:', err);
      res.writeHead(500);
      res.end('Load balancer error');
    });

    req.pipe(proxyReq);

    currentWorker = (currentWorker + 1) % workerIds.length;
  });

  server.listen(basePort, () => {
    console.log(`Load balancer running on port ${basePort}`);
    console.log(
      `Workers running on ports ${Object.values(workers)
        .map((worker: any) => worker.port)
        .join(', ')}`,
    );
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const workerPort = process.env.WORKER_PORT || (basePort + 1).toString();
  process.env.PORT = workerPort;

  require('../app.ts');
}
