import React, { useEffect, useState } from 'react';
import QuestionForm from './components/QuestionForm';
import ClientList from './components/ClientList';
import styles from './components/App.module.css';

function App() {
  const [clients, setClients] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/manager');
    setWs(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update-client-list') {
        console.log('updating client list');
        setClients(data.data);
      } else if (data.type === 'receive-answer') {
        setClients(prevClients => prevClients.map(
          client => client.name === data.data.name ? 
            { ...client, answer: `Answer ${data.data.answer}` } : client
        ));
      }
    };

    return () => {
      console.log('Websocket connection closed');
      ws.close();
      setWs(null);
    };
  }, []);

  return (
    <div className={styles.container}>
      <QuestionForm socket={ws} />
      <ClientList clients={clients} />
    </div>
  );
}

export default App;
