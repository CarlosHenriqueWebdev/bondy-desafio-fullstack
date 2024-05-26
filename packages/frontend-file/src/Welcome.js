// Welcome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Welcome() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="welcome-container">
      <h1>Welcome!</h1>
      <button onClick={handleGoBack}>Logout</button>
    </div>
  );
}

export default Welcome;
