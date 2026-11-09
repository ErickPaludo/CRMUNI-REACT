import { NavLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const SidebarItem = ({ label, to, icon: Icon, collapsed }) => (
  <Tooltip title={collapsed ? label : ""} placement="right">
    <NavLink to={to} end={to === "/"} className="sb-item">
      <Icon fontSize="small" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  </Tooltip>
);

export default SidebarItem;
