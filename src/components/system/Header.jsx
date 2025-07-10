import "../../styles/system/Header.css";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useState, useRef, useEffect} from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function Header() {  
  const { user, clearUser } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);  

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setTimeout(() => {
      navigate("/login");
    }, 10); 
  };


  return (
    <header className="header">
      <div className="header-left">EKS Assist</div>
      <div className="header-right" ref={dropdownRef}>
        <button 
          className=""
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FaUser className="header-icons"/>
          <span >{user?.userName ?? "Usuario"}</span>
        </button>
        {isDropdownOpen && (
          <div className="">
            <button
              onClick={handleLogout}
              className=""
            >
              <FaSignOutAlt className="header-icons" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
