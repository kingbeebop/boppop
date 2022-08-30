import { useState } from 'react'
import React from 'react'

function SignUp({ onNewUser }) {
  const [newUser, setNewUser] = useState({username: "", email: "", password: "", password_confirmation: ""})

  function handleSubmit(e) {
    e.preventDefault()
    onNewUser(newUser)
  }

  function handleChange(e) {
    setNewUser({...newUser, [e.target.name]: e.target.value})
  }

  return (
    <div className="form-div">
      <form className="signup-form" onSubmit={handleSubmit}>
        <label className="signup-label" htmlFor="username">Username:</label>
        <input className="form-input"
          type="text"
          id="username"
          name="username"
          value={newUser.username}
          onChange={handleChange}
        />
        <br />
        <label className="signup-label" htmlFor="email">Email:</label>
        <br />
        <input className="form-input"
          type="text"
          id="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
        />
        <br />
        <label className="signup-label" htmlFor="password">Password:</label>
        <input className="form-input"
          type="password"
          id="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
        />
        <br />
        <label className="signup-label" htmlFor="password_confirmation">Confirm Password:</label>
        <input className="form-input"
          type="password"
          id="password_confirmation"
          name="password_confirmation"
          value={newUser.password_confirmation}
          onChange={handleChange}
        />
        <br />
        <button className="form-button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SignUp