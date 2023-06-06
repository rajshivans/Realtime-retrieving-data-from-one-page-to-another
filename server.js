const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Socket.io API',
      version: '1.0.0',
      description: 'API for Socket.io checkbox updates',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/page1', (req, res) => {
  res.sendFile(__dirname + '/page1.html');
});

app.get('/page2', (req, res) => {
  res.sendFile(__dirname + '/page2.html');
});

io.on('connection', (socket) => {
  socket.on('dataUpdate', (data) => {
    io.emit('dataUpdate', data);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
