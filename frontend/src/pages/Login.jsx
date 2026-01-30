import React, { useState } from "react";
import "./auth.css";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      console.log("✅ Login response:", response.data); // Debug log

      alert("Login Successful ✅");

      // ✅ FIXED: Use response.data.user._id instead of response.data.userId
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userId", response.data.user._id); // ✅ FIXED
      sessionStorage.setItem("name", response.data.user.name);   // ✅ FIXED
      sessionStorage.setItem("xp", response.data.user.xp);       // ✅ FIXED

      console.log("✅ Stored userId:", response.data.user._id); // Debug log

      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button>Login</button>
      </form>

      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}