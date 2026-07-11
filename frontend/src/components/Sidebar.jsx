import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance";

const Sidebar = () => {
  const { user, logout, updateAvatar } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const response = await axiosInstance.put("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateAvatar(response.data.avatarUrl);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">FinSight AI</div>

      <div className="sidebar-profile">
        <button className="avatar-circle avatar-button" onClick={handleAvatarClick} title="Change profile photo">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Profile" className="avatar-img" />
          ) : (
            user?.name?.[0]?.toUpperCase()
          )}
          {uploading && <span className="avatar-uploading">...</span>}
        </button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
        <span className="profile-name">{user?.name}</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <span className="sidebar-icon">◧</span> Dashboard
        </NavLink>
        <NavLink to="/income" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <span className="sidebar-icon">₹</span> Income
        </NavLink>
        <NavLink to="/expense" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <span className="sidebar-icon">↗</span> Expense
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" onClick={toggleTheme}>
          <span className="sidebar-icon">{theme === "light" ? "🌙" : "☀️"}</span>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
        <button className="sidebar-link logout-link" onClick={handleLogout}>
          <span className="sidebar-icon">⎋</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;