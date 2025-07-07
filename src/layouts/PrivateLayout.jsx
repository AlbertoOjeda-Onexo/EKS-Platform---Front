import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/PrivateLayout.css";

function PrivateLayout({ children }) {
  return (
    <div className="layout-root">
      <Header />
      <div className="layout-content">
        <Sidebar />
        <main className="layout-main">{children}</main>
      </div>
    </div>
  );
}

export default PrivateLayout;
