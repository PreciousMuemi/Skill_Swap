import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client'; // Import the client-side library directly

const ChatSystem = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return; // Important: Don't connect if user is null

    socketRef.current = io('/chat', { // Use io() directly
      auth: { userId: user.id },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to chat server'); // Helpful for debugging
    });

    socketRef.current.on('message', handleNewMessage);
    socketRef.current.on('conversations', (data) => {
      setConversations(data); // Directly set conversations
    });

    // Clean up on unmount and user change
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]); // Add user to dependency array

  const handleNewMessage = (newMessage) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === newMessage.conversationId
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    );

    // If the new message is in the active chat, scroll to the bottom
    if (activeChat && newMessage.conversationId === activeChat.id) {
      scrollToBottom();
    }
  };


  const sendMessage = () => {
    if (!activeChat || !message) return; // Prevent sending empty messages or when no chat is selected

    socketRef.current.emit('sendMessage', {
      conversationId: activeChat.id,
      content: message, // Use 'content' for consistency (server-side likely expects 'content')
      senderId: user.id,
    });
    setMessage('');
  };

  const messagesEndRef = useRef(null); // Ref for scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeChat) {
      scrollToBottom();
    }
  }, [activeChat]);



  return (
    <div className="flex bg-midnight-blue text-white h-screen"> {/* Added h-screen for full-height */}
      {/* Conversations List */}
      <div className="w-1/4 border-r overflow-y-auto"> {/* Added overflow-y-auto for scrolling */}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveChat(conv)}
            className="p-2 hover:bg-blue-800 cursor-pointer"
          >
            {conv.participants.map((p) => p.username).join(', ')}
          </div>
        ))}
      </div>

      {/* Active Chat Window */}
      <div className="w-3/4 flex flex-col">
        <div className="flex-grow overflow-y-auto p-4" >
          {activeChat?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded ${
                msg.senderId === user.id ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'
              }`}
            >
              {msg.content} {/* Use msg.content for consistency */}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* For scrolling to bottom */}
        </div>

        <div className="p-4 flex">
          <input
            type="text"  /* Added type="text" */
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 text-black"
            placeholder="Type a message..."
            disabled={!activeChat}  /* Disable input if no active chat */
          />
          <button onClick={sendMessage} className="bg-blue-500 p-2 ml-2" disabled={!activeChat || !message}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatSystem;

