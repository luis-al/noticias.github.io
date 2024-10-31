(function() {
  // Importar React y ReactDOM
  const script1 = document.createElement('script');
  script1.src = 'https://unpkg.com/react@17/umd/react.production.min.js';
  const script2 = document.createElement('script');
  script2.src = 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js';

  // Cargar los scripts y luego inicializar el widget
  script1.onload = function() {
    document.body.appendChild(script2);
  };

  script2.onload = function() {
    initializeChatWidget();
  };

  document.body.appendChild(script1);

  function initializeChatWidget() {
    const { useState, useEffect, useRef } = React;

    function ChatWidget({ chatflowid, apiHost, chatflowConfig = {} }) {
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const chatRef = useRef(null);

      useEffect(() => {
        if (isOpen && chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, [messages, isOpen]);

      const sendMessage = async () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { type: 'user', content: input }]);
        setInput('');

        try {
          const response = await fetch(`${apiHost}/api/v1/prediction/${chatflowid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: input, ...chatflowConfig }),
          });

          if (!response.ok) throw new Error('Network response was not ok');

          const data = await response.json();
          setMessages(prev => [...prev, { type: 'bot', content: data.text }]);
        } catch (error) {
          console.error('Error:', error);
          setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, I encountered an error.' }]);
        }
      };

      return React.createElement(
        'div',
        { style: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 } },
        isOpen
          ? React.createElement(
              'div',
              { style: { width: '300px', height: '400px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' } },
              React.createElement(
                'div',
                { style: { padding: '10px', backgroundColor: '#0070f3', color: 'white', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                React.createElement('span', null, 'Chat'),
                React.createElement('button', { onClick: () => setIsOpen(false), style: { background: 'none', border: 'none', color: 'white', cursor: 'pointer' } }, '×')
              ),
              React.createElement(
                'div',
                { ref: chatRef, style: { flexGrow: 1, overflowY: 'auto', padding: '10px' } },
                messages.map((msg, index) =>
                  React.createElement(
                    'div',
                    { key: index, style: { marginBottom: '10px', padding: '8px', borderRadius: '4px', backgroundColor: msg.type === 'user' ? '#e6f3ff' : '#f0f0f0', alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start' } },
                    msg.content
                  )
                )
              ),
              React.createElement(
                'div',
                { style: { padding: '10px', borderTop: '1px solid #ddd', display: 'flex' } },
                React.createElement('input', {
                  type: 'text',
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyPress: (e) => e.key === 'Enter' && sendMessage(),
                  placeholder: 'Type a message...',
                  style: { flexGrow: 1, padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }
                }),
                React.createElement('button', { onClick: sendMessage, style: { marginLeft: '10px', padding: '5px 10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } }, 'Send')
              )
            )
          : React.createElement(
              'button',
              { onClick: () => setIsOpen(true), style: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' } },
              '💬'
            )
      );
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    ReactDOM.render(React.createElement(ChatWidget, window.ChatWidgetConfig), container);
  }
})();
