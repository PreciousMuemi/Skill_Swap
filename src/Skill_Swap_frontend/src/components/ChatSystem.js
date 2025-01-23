import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Socket } from 'socket.io-client';

const ChatSystem = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new Socket('/chat', {
      auth: { userId: user.id }
    });

    socketRef.current.on('message', handleNewMessage);
    socketRef.current.on('conversations', setConversations);

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  const handleNewMessage = (newMessage) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === newMessage.conversationId 
          ? {...conv, messages: [...conv.messages, newMessage]}
          : conv
      )
    );
  };

  const sendMessage = () => {
    socketRef.current.emit('sendMessage', {
      conversationId: activeChat.id,
      message,
      senderId: user.id
    });
    setMessage('');
  };

  return (
    <div className="flex bg-midnight-blue text-white">
      {/* Conversations List */}
      <div className="w-1/4 border-r">
        {conversations.map(conv => (
          <div 
            key={conv.id} 
            onClick={() => setActiveChat(conv)}
            className="p-2 hover:bg-blue-800 cursor-pointer"
          >
            {conv.participants.map(p => p.username).join(', ')}
          </div>
        ))}
      </div>

      {/* Active Chat Window */}
      <div className="w-3/4 flex flex-col">
        <div className="flex-grow overflow-y-auto p-4">
          {activeChat?.messages.map(msg => (
            <div 
              key={msg.id} 
              className={`mb-2 p-2 rounded ${
                msg.senderId === user.id 
                  ? 'bg-blue-600 self-end' 
                  : 'bg-gray-700 self-start'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="p-4 flex">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 text-black"
            placeholder="Type a message..."
          />
          <button 
            onClick={sendMessage}
            className="bg-blue-500 p-2 ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;