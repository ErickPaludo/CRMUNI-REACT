import Logout from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";

const iniciais = (nome) =>
  nome.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const SidebarUser = ({ nome, cargo, collapsed, "onLogout" }) => (
  <div className="sb-user">
    <div className="sb-avatar">
      {iniciais(nome)}
      <span className="sb-online" />
    </div>
    {!collapsed && (
      <>
        <div className="sb-user-info">
          <strong>{nome}</strong>""""
          <small>{cargo} · Online</small>
        </div>
        <IconButton size="small" onClick={onLogout} aria-label="Sair" className="sb-toggle">
          <Logout fontSize="small" />
        </IconButton>
      </>
    )}
  </div>
);

export default SidebarUser;
