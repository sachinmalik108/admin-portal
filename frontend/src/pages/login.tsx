import React, { useState } from "react";
import axios from "axios";

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "https://adminportal.up.railway.app/login",
        new URLSearchParams({
          username: form.username,
          password: form.password,
        })
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      onLogin();
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #232526 0%, #414345 40%, #6a82fb 70%, #00c6fb 100%)',
        padding: 0,
      }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: 480, width: '100%' }}>
        <h2 className="text-center mb-4">Admin Portal Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="form-control form-control-lg"
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="form-control form-control-lg"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
          >
            Login
          </button>
        </form>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
        <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '0.9rem' }}>
          &copy; 2025 Admin Portal
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
