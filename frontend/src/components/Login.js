//password of cena is // { //   "email": "cena@gmail.com", //   "user_type" : "admin", //   "password" : "0987632" // }

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user_type, setUser_type] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify({email: email, user_type: user_type , password: password })
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
          //save the auth token and redirect
          localStorage.setItem('token',json.autoken);
          if(user_type === "admin")
            {
              localStorage.setItem('user_type', "admin");
              navigate("/addquestion");
            }
          else
          {
            localStorage.setItem('user_type', "user");
            navigate("/userhome");
          }
          
          console.log("logged in");
        }
        else{
            alert("invalid credentials")
        }
    }

  return (
    <div className="login-container" style={{
      backgroundColor: '#1a1a1a',
      color: '#f5c518',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className="card shadow-lg p-4" style={{ backgroundColor: '#2e2e2e', color: '#f5c518', width: '400px', borderRadius: '10px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {/* Form Section */}
        <form>
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
              style={{ backgroundColor: '#1a1a1a', color: '#f5c518', border: '1px solid #f5c518' }}
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
              style={{ backgroundColor: '#1a1a1a', color: '#f5c518', border: '1px solid #f5c518' }}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="user_type" className="form-label me-3">
              User Type: 
            </label>
            <div className="form-check form-check-inline mb-1">
              <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" onClick={(e) => setUser_type("admin")}/>
              <label className="form-check-label" htmlFor="inlineRadio1">Admin</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" onClick={(e) => setUser_type("user")}/>
              <label className="form-check-label" htmlFor="inlineRadio2">User</label>
            </div>
          </div>
          <button type="submit" className="btn w-100" onClick={handleSubmit} style={{ backgroundColor: '#f5c518', color: '#1a1a1a' }}>
            Login
          </button>
        </form>
        {/* Sign Up Link */}
        <div className="text-center mt-3">
          <small>
            Don't have an account? <a href="/signup" style={{ color: '#f5c518', textDecoration: 'underline' }}>Sign up</a>
          </small>
        </div>
      </div>
    </div>
  )
}
