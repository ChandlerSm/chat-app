import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChatPage from './chat-page.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
const name = "Name holder"
root.render(
  <React.StrictMode>
    <ChatPage name={name}/>
  </React.StrictMode>
);

