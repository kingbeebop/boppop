import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react'

function Login({ onLogin, onLogout, user }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const navigate = useNavigate();
  
    function handleSubmit(e) {
      e.preventDefault();
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password})
      })
        .then((r) => r.json())
        .then((user) => {
          if(user.id){onLogin(user)}
          }
          );
    }

    function handleCreateAccount(){
        navigate("/SignUp")
    }

    function handleLogout(){
      onLogout()
    }
  
    return (
    (user===null)?
    <div className="login-form">
    <form onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="username">Username:</label>
      <input
        className="form-input"
        placeholder="Username"
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="form-label" htmlFor="password">Password:</label>
      <input
        className="form-input"
        placeholder="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="form-button" type="submit">Log In</button>
    </form>
    <button className="form-button" onClick={handleCreateAccount}>Sign Up</button>
    </div>:
    <div>
    <button className="logout-button" onClick={handleLogout}>Log Out</button>
    </div>
    )
    
  }

  export default Login