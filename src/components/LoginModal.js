import React, { useState } from "react";
import "./styles.css";

const LoginModal = ({ onClose, onLogin }) => {
  const [inputUser, setInputUser] = useState("scottm");  // Pre-filled username
  const [inputPass, setInputPass] = useState("scottm");  // Pre-filled password
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUser === "scottm" && inputPass === "scottm") {
      onLogin("Scott"); // Simulated Cognito username
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="loginmodal-backdrop">
      <div className="loginmodal-content">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={inputPass}
            onChange={(e) => setInputPass(e.target.value)}
            required
          />
          {error && <p className="loginmodal-error">{error}</p>}
          <div style={{ marginTop: "1rem" }}>
            <button type="submit">Login</button>
            <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;


