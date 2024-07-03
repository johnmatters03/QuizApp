const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', function (event) {
    console.log('Connected to the server');
    socket.send(JSON.stringify({
        type: 'initial-connection',
        client: 'host'
    }));
});

socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    if (data.type === 'update-client-list') {
        console.log('updating client list');
        const clientList = document.getElementById('client-list');
        clientList.innerHTML = '';
        data.data.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            clientList.appendChild(li);
        });
    } else if (data.type === 'receive-answer') {
        const clientList = document.getElementById('client-list');
        const existingClient = Array.from(clientList.children).find(li => li.textContent.startsWith(data.data.name));
        if (existingClient) {
            existingClient.textContent = `${data.data.name}: Answer ${data.data.answer}`;
        } else {
            const li = document.createElement('li');
            li.textContent = `${data.data.name}: Answer ${data.data.answer}`;
            clientList.appendChild(li);
        }
    }
});

document.getElementById('question-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const question = document.getElementById('question').value;
    const answers = [
        document.getElementById('answer1').value,
        document.getElementById('answer2').value,
        document.getElementById('answer3').value,
        document.getElementById('answer4').value,
    ];
    const correctAnswer = document.getElementById('correctAnswer').value;

    socket.send(JSON.stringify({
        type: 'new-question',
        question, answers, correctAnswer
    }));
});
