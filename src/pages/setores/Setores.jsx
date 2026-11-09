import LayersOutlined from "@mui/icons-material/LayersOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutlineOutlined";
import "../funcionarios/Funcionarios.css";
import "./Setores.css";

// shortcut: setores fixos em memória, trocar por useApi (GET setores da empresa) quando a API existir.
const SETORES = [
  { id: 1, nome: "Comercial", descricao: "Novos leads, planos e conversões", funcionarios: 5, cor: "azul" },
  { id: 2, nome: "Financeiro", descricao: "Pagamentos, cobranças e matrículas", funcionarios: 3, cor: "verde" },
  { id: 3, nome: "Suporte", descricao: "Dúvidas e atendimento aos alunos", funcionarios: 4, cor: "roxo" },
];

const Setores = () => (
  <div className="func">
    <header className="func-head">
      <div>
        <h1>Setores</h1>
        <p className="setores-sub">Organize equipes e transferências de atendimento.</p>
      </div>
    </header>

    <div className="setores-grid">
      {SETORES.map((s) => (
        <div className="func-card setor-card" key={s.id}>
          <span className={`setor-icon ${s.cor}`}>
            <LayersOutlined fontSize="small" />
          </span>
          <h2>
            {s.nome} <em className="func-badge online">Ativo</em>
          </h2>
          <p>{s.descricao}</p>
          <footer>
            <PeopleOutline fontSize="small" /> {s.funcionarios} funcionários
          </footer>
        </div>
      ))}
    </div>
  </div>
);

export default Setores;
