import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import ProtectedRoute from "./ProtectedRoute";


const App = () => {
 // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // You can manage authentication state using context or other state management libraries

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        
        <Route
          path="/home"
          element={
           
              <HomePage />
           
          }
        />
        <Route
          path="/chat/:userId"
          element={
            //<ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChatPage />
            //</ProtectedRoute>
          }
        />
        {/* Add a 404 Not Found Page if desired */}
      </Routes>
    </Router>
  );
};

export default App;
