const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];
let host = null;

app.use(express.static('public'));

wss.on('connection', 
    function(socket) {
        // console.log('A client connected');
        let clientId = null;
        socket.on('message', function(message) {
            const data = JSON.parse(message);
            switch (data.type) {
                case 'initial-connection':
                    if (host != null && data.client == 'host') {
                        console.log('host trying to connect when host already connected');
                    } else if (data.client == 'host') {
                        console.log('host connection established');
                        host = socket;
                    } else {
                        console.log('client connection established');
                        clientId = Math.random().toString(36).substr(2, 9);
                        clients.push({ id: clientId, socket });
                    }
                    break;
                case 'join-game':
                    console.log('client %s joining the game', data.name);
                    const clientInfo = { id: clientId, name: data.name, socket };
                    clients = clients.map(c => c.id === clientId ? clientInfo : c);
                    broadcast('update-client-list', clients.map(client => client.name));
                    if (host != null) {
                        host.send(JSON.stringify({ type: 'update-client-list', data: clients.map(client => client.name)}));
                    }
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
        if (clientId == null) {
            console.log('host disconnected');
            host = null;
        } else {
            clients = clients.filter(client => client.id !== clientId);
            broadcast('update-client-list', clients.map(client => client.name));
            if (host != null) {
                host.send(JSON.stringify({ type: 'update-client-list', data: clients.map(client => client.name)}));
            }
            console.log('User disconnected');
        }
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
