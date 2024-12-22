import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify({email: email, password: password })
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            //save the auth token and redirect
            localStorage.setItem('token',json.autoken);
            navigate("/addquestion");
            console.log("logged in");
        }
        else{
            alert("invalid credentials")
        }
    }

    // const onChange = (e) => {
    //     setcredentials({ ...credentials, [e.target.name]: e.target.value })
    // }


  return (
    <div>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {/* {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )} */}
        <form 
        // onSubmit={handleLogin}
        >
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" onClick={handleSubmit}>
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <small>
            Don't have an account? <a href="/signup">Sign up</a>
          </small>
        </div>
      </div>
    </div>
    </div>
  )
}
