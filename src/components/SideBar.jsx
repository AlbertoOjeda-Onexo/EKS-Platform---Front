import "../styles/Sidebar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useSidebarStore } from "../store/sideBarStore";
import { FaBars, FaUserCircle, FaHome, FaClipboardList } from "react-icons/fa";

export default function Sidebar() {
  const { collapsed, toggleSidebar } = useSidebarStore();
  const { user } = useUserStore();  

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <FaBars className="toggle-btn" onClick={toggleSidebar} />
        {!collapsed && <span className="sidebar-title">Capital Humano</span>}
      </div>

      <div className="sidebar-content">
        <Link to="/" className="sidebar-item">
          <FaClipboardList/>
          {!collapsed && <span>Vacantes</span>}
        </Link>
        <Link to="/dashboard" className="sidebar-item">
          <FaUserCircle />
          {!collapsed && <span>Candidatos</span>}
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
