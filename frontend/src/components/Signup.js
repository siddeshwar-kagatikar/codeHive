import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [user_type, setUser_type] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name, user_type: user_type, email: email, password: password })
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.autoken);
            if (user_type === "admin") {
                localStorage.setItem('user_type', true);
                navigate("/addquestion");
            } else {
                localStorage.setItem('user_type', false);
                navigate("/userhome");
            }
            console.log("signed in");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="signup-container" style={{
            backgroundColor: '#1a1a1a',
            color: '#f5c518',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="card shadow-lg p-4" style={{ backgroundColor: '#2e2e2e', color: '#f5c518', width: '400px', borderRadius: '10px' }}>
                <h2 className="text-center mb-4">Signup</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ backgroundColor: '#1a1a1a', color: '#f5c518', border: '1px solid #f5c518' }}
                        />
                    </div>
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
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" onClick={() => setUser_type("admin")} />
                            <label className="form-check-label" htmlFor="inlineRadio1">Admin</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" onClick={() => setUser_type("user")} />
                            <label className="form-check-label" htmlFor="inlineRadio2">User</label>
                        </div>
                    </div>
                    <button type="submit" className="btn w-100" onClick={handleSubmit} style={{ backgroundColor: '#f5c518', color: '#1a1a1a' }}>
                        Signup
                    </button>
                </form>
            </div>
        </div>
    );
}
