const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(express.static('public'));

wss.on('connection', function(socket) {
    console.log('A user connected');
    const clientId = Math.random().toString(36).substr(2, 9);
    clients.push({ id: clientId, socket });

    socket.on('message', function(message) {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'join-game':
                const clientInfo = { id: clientId, name: data.name, socket };
                clients = clients.map(c => c.id === clientId ? clientInfo : c);
                broadcast('update-client-list', clients.map(client => client.name));
                break;
            case 'new-question':
                broadcast('question', data);
                break;
            case 'answer':
                const client = clients.find(client => client.id === clientId);
                if (client) {
                    broadcast('receive-answer', { name: client.name, answer: data.answer });
                }
                break;
        }
    });

    socket.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
        broadcast('update-client-list', clients.map(client => client.name));
        console.log('User disconnected');
    });
});

function broadcast(type, data) {
    clients.forEach(client => {
        client.socket.send(JSON.stringify({ type, data }));
    });
}

server.listen(3000, () => {
    console.log('Listening on port 3000');
});
