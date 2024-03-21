var express = require('express');
var expressModule = require('express');
var parse = require('url').parse;
var next = require('next');
var dev = process.env.NODE_ENV !== 'production';
var app = next({ dev: dev });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    var server = express();
    // Custom middleware or routes
    server.get('/custom-route', function (req, res) {
        var parsedUrl = parse(req.url, true);
        return app.render(req, res, '/custom-page', parsedUrl.query);
    });
    server.all('*', function (req, res) {
        return handle(req, res);
    });
    var PORT = 3000;
    server.listen(PORT, function () {
        console.log("Express server is listening on port ".concat(PORT));
    });
});
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
