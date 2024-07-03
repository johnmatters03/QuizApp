import React from 'react';

function ClientList({ clients }) {
  return (
    <ul>
      {clients.map((client, index) => (
        <li key={index}>{client.name}: {client.answer || 'Waiting for response...'}</li>
      ))}
    </ul>
  );
}

export default ClientList;
