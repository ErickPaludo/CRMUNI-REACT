import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import TrendingUp from "@mui/icons-material/TrendingUp";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import PsychologyOutlined from "@mui/icons-material/PsychologyOutlined";
import BarChart from "@mui/icons-material/BarChart";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import ManageAccountsOutlined from "@mui/icons-material/ManageAccountsOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import PowerOutlined from "@mui/icons-material/PowerOutlined";

export const menuSections = [
  {
    items: [
      { label: "Dashboard", to: "/", icon: DashboardOutlined },
      { label: "Atendimento", to: "/atendimento", icon: ChatBubbleOutlined },
      { label: "Clientes", to: "/clientes", icon: PeopleOutlined },
      { label: "Funil de Vendas", to: "/funil", icon: TrendingUp },
      { label: "Pedidos / Matrículas", to: "/pedidos", icon: ShoppingBagOutlined },
      { label: "Relatórios", to: "/relatorios", icon: BarChart },
    ],
  },
  {
    title: "Configurações",
    items: [
      { label: "Empresa", to: "/empresa", icon: ApartmentOutlined },
      { label: "Funcionários", to: "/funcionarios", icon: ManageAccountsOutlined },
      { label: "Administradores", to: "/administradores", icon: ShieldOutlined },
      { label: "Setores", to: "/setores", icon: LayersOutlined },
      { label: "Planos", to: "/planos", icon: ShoppingBagOutlined },
    ],
  },
];
