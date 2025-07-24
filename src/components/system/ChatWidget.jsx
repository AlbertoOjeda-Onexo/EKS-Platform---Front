import { useState, useEffect, useRef } from 'react';
import '../../styles/Components/ChatWidget.css';
import axios from 'axios';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Cargar mensajes desde localStorage al inicio
    const saved = localStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Guardar en localStorage cada vez que cambien los mensajes
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Auto-scroll al fondo
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, from: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/ask/`,
        { question: input },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const assistantReply = response.data.response;
      const cleanResponse = assistantReply.replace(/【.*?†source】/g, '');
      setMessages(prev => [...prev, { text: cleanResponse, from: 'bot' }]);

    } catch (error) {
      console.error('Error al contactar al backend:', error);
      setMessages(prev => [...prev, {
        text: 'Hubo un problema al contactar al asistente. Intenta nuevamente más tarde.',
        from: 'bot'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">🧠 EKS Assistant</div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Enviar</button>
          </div>
        </div>
      )}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>
    </>
  );
}
