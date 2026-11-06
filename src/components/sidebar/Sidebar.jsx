import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import SidebarHeader from "./SidebarHeader";
import SidebarAlert from "./SidebarAlert";
import SidebarSection from "./SidebarSection";
import SidebarUser from "./SidebarUser";
import { menuSections } from "./menu";
import "./Sidebar.css";

// shortcut: usuário e alertas são placeholders, ligar ao useAuth/API quando existirem.
const Sidebar = ({ user = { nome: "Carlos Silva", cargo: "Atendente" }, alertas = 3 }) => {
  const navigate = useNavigate();
  const small = useMediaQuery("(max-width:900px)");
  const [collapsed, setCollapsed] = useState(small);
  useEffect(() => setCollapsed(small), [small]);

  return (
    <aside className={`sb ${collapsed ? "sb-collapsed" : ""}`}>
      <SidebarHeader collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      {alertas > 0 && <SidebarAlert text={`${alertas} alertas de tempo`} collapsed={collapsed} />}
      <div className="sb-nav">
        {menuSections.map((s, i) => (
          <SidebarSection key={i} {...s} collapsed={collapsed} />
        ))}
      </div>
      <SidebarUser {...user} collapsed={collapsed} onLogout={() => navigate("/login")} />
    </aside>
  );
};

export default Sidebar;
