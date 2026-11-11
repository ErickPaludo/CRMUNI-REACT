import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUsuario } from "../../hooks/useUsuario";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
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
  const [aviso, setAviso] = useState("");

  // Administrador (UsuarioRetornoDto) traz empresaId; funcionário traz o objeto empresa.
  const idEmpresa = usuario?.empresaId ?? usuario?.empresa?.id;
  // Sem telefone na rota: o cliente informa o celular no popup da tela de mensagem.
  const compartilhar = async () => {
    const link = `${window.location.origin}${import.meta.env.BASE_URL}${idEmpresa}/mensagem`;
    try {
      await navigator.clipboard.writeText(link);
      setAviso("Link do chat copiado. Envie para o cliente.");
    } catch {
      setAviso(link); // sem permissão de área de transferência: mostra o link para copiar à mão
    }
  };

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
        {idEmpresa && (
          <Tooltip title={collapsed ? "Compartilhar chat do cliente" : ""} placement="right">
            <button type="button" className="sb-item sb-compartilhar" onClick={compartilhar}>
              <ShareOutlined fontSize="small" />
              {!collapsed && <span>Compartilhar chat</span>}
            </button>
          </Tooltip>
        )}
      </div>
      <Snackbar
        open={!!aviso}
        autoHideDuration={3000}
        onClose={() => setAviso("")}
        message={aviso}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
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
