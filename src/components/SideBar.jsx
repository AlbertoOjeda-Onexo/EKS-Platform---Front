import { useState } from "react";
import "../styles/system/Sidebar.css";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useSidebarStore } from "../store/sideBarStore";
import { FaBars, FaUserCircle, FaClipboardList, FaAngleDown, FaBriefcase, FaFolderOpen } from "react-icons/fa";

export default function Sidebar() {
  const { collapsed, toggleSidebar } = useSidebarStore();
  const { user } = useUserStore();

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <FaBars className="toggle-btn" onClick={toggleSidebar} />
        {!collapsed && <span className="sidebar-title">Sistema</span>}
      </div>

      <div className="sidebar-content">        
        <div className="sidebar-section">
          <div className="sidebar-item" onClick={() => toggleSection("capitalHumano")}>
            <FaBriefcase />
            {!collapsed && (
              <>
                <span style={{ marginRight: "6px" }}>Capital Humano</span>
                <FaAngleDown
                  className={`dropdown-icon ${openSection === "capitalHumano" ? "open" : ""}`}
                />
              </>
            )}
          </div>

          {!collapsed && openSection === "capitalHumano" && (
            <div className="sidebar-subitems">
              <Link to="/customFields" className="sidebar-subitem">
                <FaClipboardList style={{ marginRight: "6px" }}/>
                <span>Formulario</span>
              </Link>
              <Link to="/vacantes" className="sidebar-subitem">
                <FaFolderOpen style={{ marginRight: "6px" }}/>
                <span>Vacantes</span>
              </Link>
              <Link to="/candidatos" className="sidebar-subitem">
                <FaUserCircle style={{ marginRight: "6px" }}/>
                <span>Candidatos</span>
              </Link>              
            </div>
          )}
        </div>
        
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
