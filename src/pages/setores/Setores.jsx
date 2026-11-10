import LayersOutlined from "@mui/icons-material/LayersOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutlineOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { useSetores } from "../../hooks/useSetores";
import "../funcionarios/Funcionarios.css";
import "./Setores.css";

// setores vêm do SetoresProvider (GET /setor, carregado ao autenticar); a cor segue o tipo do setor.
const CORES = ["azul", "verde", "roxo"];

const Setores = () => {
  const { setores, carregando } = useSetores();
  return (
  <div className="func">
    <header className="func-head">
      <div>
        <h1>Setores</h1>
        <p className="setores-sub">Organize equipes e transferências de atendimento.</p>
      </div>
    </header>

    <div className="setores-grid">
      {carregando && <CircularProgress size={28} aria-label="Carregando setores" />}
      {!carregando && !setores.length && <p className="setores-sub">Nenhum setor encontrado.</p>}
      {setores.map((s) => (
        <div className="func-card setor-card" key={s.id}>
          <span className={`setor-icon ${CORES[s.tipo] ?? "azul"}`}>
            <LayersOutlined fontSize="small" />
          </span>
          <h2>
            {s.nome} <em className="func-badge online">Ativo</em>
          </h2>
          <p>{s.descricao}</p>
          <footer>
            <PeopleOutline fontSize="small" /> {s.quantidadeFuncionarios} funcionários
          </footer>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Setores;
