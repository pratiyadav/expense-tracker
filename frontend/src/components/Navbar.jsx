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
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <div>
        <Link to="/">Dashboard</Link>
      </div>
      <div>
        <span>Hi, {user.name}</span>
        <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;