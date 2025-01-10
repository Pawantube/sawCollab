// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import api from "../src/api"; // Import the Axios instance

// const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE_URL||"http://localhost:5000";

// const ChatPage = () => {
//   const { userId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const socket = useRef(null);

//   useEffect(() => {
//     // Initialize Socket.IO connection
//     socket.current = io(SOCKET_SERVER_URL, { query: { userId: "currentUserId" } });

//     socket.current.on("receiveMessage", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, [userId]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     const message = { senderId: "currentUserId", receiverId: userId, content: input };
//     socket.current.emit("sendMessage", message);
//     setMessages((prev) => [...prev, message]);
//     setInput("");
//   };

//   return (
//     <div className="chat-page">
//       <h1>Chat with {userId}</h1>
//       <div className="messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={msg.senderId === "currentUserId" ? "sent" : "received"}>
//             {msg.content}
//           </div>
//         ))}
//       </div>
//       <form onSubmit={sendMessage}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message"
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default ChatPage;
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../src/api"; // Import the Axios instance

const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const ChatPage = () => {
  const { userId } = useParams(); // Receiver's userId from URL params
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef(null);
  const currentUserId = localStorage.getItem("userId"); // Get current userId from localStorage

  useEffect(() => {
    // Initialize Socket.IO connection
    socket.current = io(SOCKET_SERVER_URL, {
      query: { userId: currentUserId },
    });

    // Fetch existing chat history
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/api/messages`, {
          params: { sender: currentUserId, receiver: userId },
        });
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socket.current.on("receiveMessage", (message) => {
      if (
        (message.senderId === userId && message.receiverId === currentUserId) || 
        (message.senderId === currentUserId && message.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      // Disconnect socket on cleanup
      socket.current.disconnect();
    };
  }, [userId, currentUserId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message = { senderId: currentUserId, receiverId: userId, content: input };

    try {
      // Save message to MongoDB
      await api.post("/api/messages", message);

      // Emit message to server
      socket.current.emit("sendMessage", message);

      // Optimistically update UI
      setMessages((prev) => [...prev, message]);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat-page">
      <h1>Chat with User {userId}</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.senderId === currentUserId ? "sent" : "received"}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
