import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // Import the Axios instance

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/"); // Redirect to login if not authenticated
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    checkAuth();
    fetchUsers();
  }, [navigate]);

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`); // Navigate to the chat page for the selected user
  };

  return (
    <div className="home-page">
      <h1>Connected Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <span>{user.username}</span>
            <button onClick={() => handleChat(user._id)}>Chat</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
