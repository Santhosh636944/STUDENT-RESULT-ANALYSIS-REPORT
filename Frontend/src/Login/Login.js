import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Import CSS for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="container-login">
      <div className="login-box">
        <h2 style={{color:"#007bff",fontWeight:"600"}}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn">Login</button>
          <div className="links">
            <a href="#">Forgot <b>Password?</b></a>
          </div>
          <p style={{ marginTop: "10px", fontSize: "14px",color:"black" }}>
            Don't have an account? <a href="/"><b>Sign up</b></a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
