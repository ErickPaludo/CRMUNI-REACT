import SidebarItem from "./SidebarItem";

const SidebarSection = ({ title, items, collapsed }) => (
  <div className="sb-section">
    {title && (collapsed ? <hr className="sb-divider" /> : <div className="sb-title">{title}</div>)}
    {items.map((i) => (
      <SidebarItem key={i.to} {...i} collapsed={collapsed} />
    ))}
  </div>
);

export default SidebarSection;
