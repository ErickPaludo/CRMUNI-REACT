import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUsuario } from "../../hooks/useUsuario";
import useMediaQuery from "@mui/material/useMediaQuery";
import SidebarHeader from "./SidebarHeader";
import SidebarAlert from "./SidebarAlert";
import SidebarSection from "./SidebarSection";
import SidebarUser from "./SidebarUser";
import { menuSections } from "./menu";
import "./Sidebar.css";

// shortcut: alertas ainda é placeholder, ligar à API quando existir.
const Sidebar = () => {
  const navigate = useNavigate();
  const { sair } = useAuth();
  const { usuario, nome } = useUsuario();
  const user = { nome, cargo: usuario?.setor?.nome ?? "" };
  const small = useMediaQuery("(max-width:900px)");
  const [collapsed, setCollapsed] = useState(small);
  useEffect(() => setCollapsed(small), [small]);

  return (
    <aside className={`sb ${collapsed ? "sb-collapsed" : ""}`}>
      <SidebarHeader
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div className="sb-nav">
        {menuSections.map((s, i) => (
          <SidebarSection key={i} {...s} collapsed={collapsed} />
        ))}
      </div>
      <SidebarUser
        {...user}
        collapsed={collapsed}
        onLogout={async () => {
          await sair();
          navigate("/login");
        }}
      />
    </aside>
  );
};

export default Sidebar;
