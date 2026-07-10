import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FinSight AI</Link>
      <div className="navbar-user">
        <span>Hi, {user.name}</span>
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;