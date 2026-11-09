import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const SidebarLayout = () => (
  <div className="sb-layout">
    <Sidebar />
    <main className="sb-content">
      <Outlet />
    </main>
  </div>
);

export default SidebarLayout;
