import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "./App.css";
import jwt_decode from "jwt-decode";

function Welcome() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserEmail(decodedToken.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <div className="welcome-container">
      <Confetti />
      <h1 className="welcome-title">Welcome, {userEmail}!</h1>
      <button className="welcome-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Welcome;
