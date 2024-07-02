const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', function (event) {
    console.log('Connected to the server');
    socket.send(JSON.stringify({
        type: 'initial-connection',
        client: 'user'
    }));
});

socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    if (data.type === 'question') {
        document.getElementById('question').textContent = data.data.question;
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`answer${i}`).textContent = data.data.answers[i - 1];
        }
    }
});

function joinGame() {
    const name = document.getElementById('name').value;
    if (name) {
        socket.send(JSON.stringify({ type: 'join-game', name }));
        document.getElementById('login').style.display = 'none';
        document.getElementById('quiz').style.display = 'block';
    } else {
        alert("Please enter your name.");
    }
}

function sendAnswer(answer) {
    const name = document.getElementById('name').value;
    socket.send(JSON.stringify({ type: 'answer', name, answer }));
}
