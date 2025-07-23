// src/pages/Chat.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');
  const bottomRef = useRef(null);

  const load = async () => {
    try {
      const res = await fetch(`${backend}/order/vendor/messages/${id}`, {
        headers: { Authorization: token }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Load messages error:', error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, [id]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const send = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${backend}/order/vendor/message/send/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ message: text.trim() })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setText('');
        load();
      } else {
        alert(data.message || 'Failed to send');
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  if (loading) {
    return (
      <div className="screen-content">
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Chat</h2>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 56 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: 8,
            textAlign: msg.sender_phone === token ? 'right' : 'left'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: 16,
              background: msg.sender_phone === token ? 'var(--primary-gradient)' : 'var(--background-soft)',
              color: msg.sender_phone === token ? '#fff' : 'inherit'
            }}>{msg.message}</span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', padding: 12, background: '#fff', borderTop: '1px solid var(--divider)' }}>
        <input style={{ flex: 1, border: '1px solid var(--divider)', borderRadius: 20, padding: '8px 12px' }} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
        <button className="btn btn-primary" style={{ marginLeft: 8 }} onClick={send}>Send</button>
      </div>
    </div>
  );
}