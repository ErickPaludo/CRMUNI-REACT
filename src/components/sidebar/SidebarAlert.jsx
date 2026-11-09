import NotificationsNone from "@mui/icons-material/NotificationsNone";

const SidebarAlert = ({ text, collapsed }) => (
  <div className="sb-alert" title={text}>
    <NotificationsNone fontSize="small" />
    {!collapsed && <span>{text}</span>}
  </div>
);

export default SidebarAlert;
