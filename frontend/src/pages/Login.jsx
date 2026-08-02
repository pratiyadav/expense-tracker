import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginHero from "../assets/login-hero.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-visual">
        <img src={loginHero} alt="Financial planning" className="auth-visual-img" />
        <div className="auth-visual-overlay">
          <h2 className="auth-visual-title">Track every rupee, effortlessly</h2>
          <p className="auth-visual-subtitle">
            Snap a photo of your receipt and let AI handle the rest.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-container">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className="auth-form">
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
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="btn-primary btn-full">Login</button>
          </form>
          <p className="auth-link"><Link to="/forgot-password">Forgot password?</Link></p>
          <p className="auth-link">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;