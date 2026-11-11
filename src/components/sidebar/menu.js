import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import SupportAgentOutlined from "@mui/icons-material/SupportAgentOutlined";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import ViewKanbanOutlined from "@mui/icons-material/ViewKanbanOutlined";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import PsychologyOutlined from "@mui/icons-material/PsychologyOutlined";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import ManageAccountsOutlined from "@mui/icons-material/ManageAccountsOutlined";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import PowerOutlined from "@mui/icons-material/PowerOutlined";

export const menuSections = [
  {
    items: [
      { label: "Dashboard", to: "/", icon: DashboardOutlined },
      { label: "Mensagens", to: "/mensagens", icon: ChatBubbleOutlined },
      { label: "Atendimentos", to: "/atendimentos", icon: SupportAgentOutlined },
      { label: "Funil de Vendas", to: "/funis", icon: FilterAltOutlined },
      { label: "Etapas", to: "/etapas", icon: ViewKanbanOutlined },
    ],
  },
  {
    title: "Configurações",
    items: [
      { label: "Empresa", to: "/empresa", icon: ApartmentOutlined },
      { label: "Funcionários", to: "/funcionarios", icon: ManageAccountsOutlined },
      { label: "Setores", to: "/setores", icon: LayersOutlined },
      { label: "Planos", to: "/planos", icon: ShoppingBagOutlined },
    ],
  },
];
