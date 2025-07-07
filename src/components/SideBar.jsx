import "../styles/Sidebar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { FaBars, FaUserCircle, FaHome } from "react-icons/fa";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUserStore();

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <FaBars className="toggle-btn" onClick={toggleSidebar} />
        {!collapsed && <span className="sidebar-title">EKS Assist</span>}
      </div>

      <div className="sidebar-content">
        <Link to="/" className="sidebar-item">
          <FaHome />
          {!collapsed && <span>Inicio</span>}
        </Link>
        <Link to="/dashboard" className="sidebar-item">
          <FaUserCircle />
          {!collapsed && <span>Dashboard</span>}
        </Link>
      </div>

      {user && (
        <div className="sidebar-footer">
          <FaUserCircle className="sidebar-icons" />
          {!collapsed && <span>{user.userName}</span>}
        </div>
      )}
    </div>
  );
}
