import LinearProgress from "@mui/material/LinearProgress";
import { useCarregando } from "../hooks/carregamento";

// Barra fixa no topo de qualquer tela enquanto houver requisição à API em andamento.
const Carregando = () =>
  useCarregando() ? (
    <LinearProgress
      aria-label="Carregando"
      sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 2000, height: 3 }}
    />
  ) : null;

export default Carregando;
