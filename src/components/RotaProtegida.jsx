import { Navigate, Outlet } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../hooks/useAuth";

const RotaProtegida = () => {
  const { isAuthenticated, carregando } = useAuth();
  if (carregando) {
    // aguarda o refresh inicial antes de decidir
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress aria-label="Carregando" />
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RotaProtegida;
