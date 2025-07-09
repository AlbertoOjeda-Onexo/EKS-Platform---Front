import Header from "../components/Header";
import "../styles/system/PrivateLayout.css";
import Sidebar from "../components/SideBar";
import { useSidebarStore } from "../store/sideBarStore"; 

function PrivateLayout({ children }) {
  const isCollapsed = useSidebarStore((state) => state.collapsed); 

  return (
    <div className="layout-root">
      <Header />
      <div className="layout-content">
        <Sidebar />
        <main className={`layout-main ${isCollapsed ? "collapsed" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default PrivateLayout;
