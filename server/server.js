// server.js
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let managerClient = null;
let userClients = [];

wss.on('connection', (ws, req) => {
  const clientType = req.url.substring(1); // Assuming URL is like /manager or /user

  if (clientType === "manager") {
    console.log('Manager connected');
    managerClients = ws;
  } else if (clientType === "user") {
    console.log('User connected');
    userClients.push(ws);
  } else {
    console.log('Unknown connection, terminating');
    ws.close()
  }

  ws.on('message', (message) => {
    console.log('receiving message from %s', clientType);
    if (clientType === "manager") {
      // Broadcast to users
      userClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(String(message));
        }
      });
    } else if (clientType === "user") {
      // Broadcast to managers
      if (managerClient.readyState == WebSocket.OPEN) {
        managerClient.send(String(message));
      }
    }
  });

  ws.on('close', () => {
    if (clientType === "manager") {
        console.log('Manager disconnected');
        managerClient = null;
    } else if (clientType === "user") {
        console.log('User disconnected');
        userClients = userClients.filter(client => client !== ws);
    }
  });
});

server.listen(8080, () => {
  console.log('Server started on http://localhost:8080');
});
