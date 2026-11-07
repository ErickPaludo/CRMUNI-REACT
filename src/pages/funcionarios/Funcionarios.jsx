import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlined from "@mui/icons-material/EditOutlined";
import ManageAccountsOutlined from "@mui/icons-material/ManageAccountsOutlined";
import "./Funcionarios.css";

const CAPACIDADE = 10;
const SETORES = ["Comercial", "Financeiro", "Suporte"];
const STATUS = { online: "Online", ocupado: "Ocupado", offline: "Offline" };

// shortcut: dados fixos em memória, trocar por useApi (GET/POST funcionários da empresa) quando a API existir.
const INICIAL = [
  { id: 1, nome: "Ana Souza", email: "ana@movimento.com.br", setor: "Comercial", status: "online", atendimentos: 7 },
  { id: 2, nome: "Lucas Oliveira", email: "lucas@movimento.com.br", setor: "Comercial", status: "ocupado", atendimentos: 10 },
  { id: 3, nome: "Rafael Lima", email: "rafael@movimento.com.br", setor: "Financeiro", status: "online", atendimentos: 4 },
  { id: 4, nome: "Juliana Alves", email: "juliana@movimento.com.br", setor: "Suporte", status: "offline", atendimentos: 0 },
];

const VAZIO = { nome: "", email: "", setor: SETORES[0] };

const Funcionarios = () => {
  const [lista, setLista] = useState(INICIAL);
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState(VAZIO);
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return lista.filter((f) => f.nome.toLowerCase().includes(q) || f.email.toLowerCase().includes(q));
  }, [lista, busca]);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const salvar = (e) => {
    e.preventDefault();
    setLista([...lista, { ...form, id: Date.now(), status: "offline", atendimentos: 0 }]);
    setForm(VAZIO);
    setAberto(false);
  };

  return (
    <div className="func">
      <header className="func-head">
        <div>
          <h1>Funcionários</h1>
          <p>
            {lista.length} colaboradores cadastrados · capacidade máxima de {CAPACIDADE} atendimentos por atendente.
          </p>
        </div>
        <button className="func-btn" onClick={() => setAberto(true)}>
          <AddIcon fontSize="small" /> Adicionar
        </button>
      </header>

      {aberto && (
        <form className="func-card func-form" onSubmit={salvar}>
          <div className="func-form-title">
            <ManageAccountsOutlined fontSize="small" color="primary" />
            <strong>Novo funcionário</strong>
            <button type="button" className="func-icon" aria-label="Fechar" onClick={() => setAberto(false)}>
              <CloseIcon fontSize="small" />
            </button>
          </div>
          <div className="func-fields">
            <label>
              Nome
              <input required value={form.nome} onChange={set("nome")} />
            </label>
            <label>
              E-mail
              <input required type="email" value={form.email} onChange={set("email")} />
            </label>
            <label>
              Setor
              <select value={form.setor} onChange={set("setor")}>
                {SETORES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="func-btn func-save" type="submit">
            Salvar funcionário
          </button>
        </form>
      )}

      <div className="func-search">
        <SearchIcon fontSize="small" />
        <input placeholder="Buscar funcionário..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <div className="func-card func-table">
        <div className="func-row func-th">
          <span>Funcionário</span>
          <span>Setor</span>
          <span>Status</span>
          <span>Atendimentos</span>
          <span>Permissão</span>
          <span />
        </div>
        {filtrados.map((f) => (
          <div className="func-row" key={f.id}>
            <span className="func-nome">
              <strong>{f.nome}</strong>
              <small>{f.email}</small>
            </span>
            <span>{f.setor}</span>
            <span>
              <em className={`func-badge ${f.status}`}>{STATUS[f.status]}</em>
            </span>
            <span className={`func-mono ${f.atendimentos >= CAPACIDADE ? "cheio" : ""}`}>
              {f.atendimentos}/{CAPACIDADE}
            </span>
            <span>Atendente</span>
            {/* shortcut: edição ainda não implementada (fora do escopo: só cadastro e listagem) */}
            <button className="func-icon" aria-label={`Editar ${f.nome}`} disabled>
              <EditOutlined fontSize="small" />
            </button>
          </div>
        ))}
        {!filtrados.length && <div className="func-vazio">Nenhum funcionário encontrado.</div>}
      </div>
    </div>
  );
};

export default Funcionarios;
