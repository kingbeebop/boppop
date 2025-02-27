import express from 'express';
import { parse } from 'url';
import next from 'next';
import cors from 'cors';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();
    const server = express();

    // Configure CORS middleware
    server.use(cors({
      origin: 'http://167.172.251.135',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'], // Add any other required headers
      credentials: true, // Allow cookies to be sent with the request
      preflightContinue: false,
      optionsSuccessStatus: 200,
    }));

    // Custom middleware or routes
    server.get('/custom-route', (req, res) => {
      const parsedUrl = parse(req.url!, true);
      return app.render(req, res, '/custom-page', parsedUrl.query);
    });

    // Health check endpoint
    server.get('/api/health', (req, res) => {
      console.log('Health check requested');
      res.status(200).json({ status: 'healthy' });
    });

    // Handle all other routes with Next.js
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, () => {
      console.log(`> Ready on http://167.172.251.135:${port}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();




// const express = require('express');
// const expressModule = require('express');
// const { parse } = require('url');
// const next = require('next');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // Custom middleware or routes
//   server.get('/custom-route', (req: Request, res: Response) => {
//     const parsedUrl = parse(req.url!, true);
//     return app.render(req, res, '/custom-page', parsedUrl.query);
//   });

//   server.all('*', (req: Request, res: Response) => {
//     return handle(req, res);
//   });

//   const PORT = 3000;

//   server.listen(PORT, () => {
//     console.log(`Express server is listening on port ${PORT}`);
//   });
// });



// import express, { Request, Response } from 'express';
// import { parse } from 'url';
// import next from 'next';
// import * as fs from 'fs';
// import * as net from 'net';

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // Custom middleware or routes
//   server.get('/custom-route', (req: Request, res: Response) => {
//     const parsedUrl = parse(req.url!, true);
//     return app.render(req, res, '/custom-page', parsedUrl.query);
//   });

//   server.all('*', (req: Request, res: Response) => {
//     return handle(req, res);
//   });

//   const unixSocketPath = '/run/nodeapp/socket.sock';
//   const unixServer = net.createServer((socket) => {
//     socket.end('Connected to Node.js Unix socket server!\n');
//   });

//   // Remove existing socket file if present
//   if (fs.existsSync(unixSocketPath)) {
//     fs.unlinkSync(unixSocketPath);
//   }

//   // Start listening on the Unix socket
//   unixServer.listen(unixSocketPath, () => {
//     console.log(`Unix socket server running at ${unixSocketPath}`);
//   });

//   // Attach the server to the Unix socket
//   server.listen(unixSocketPath, () => {
//     console.log(`Express server is listening on Unix socket ${unixSocketPath}`);
//   });
// });