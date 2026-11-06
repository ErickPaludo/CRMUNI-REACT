import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";

const SidebarHeader = ({ collapsed, onToggle }) => (
  <div className="sb-header">
    <div className="sb-logo">
      <ChatBubbleOutlined fontSize="small" />
    </div>
    {!collapsed && <strong className="sb-brand">CRMUNI</strong>}
    <IconButton size="small" onClick={onToggle} className="sb-toggle" aria-label="Alternar menu">
      {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
    </IconButton>
  </div>
);

export default SidebarHeader;
