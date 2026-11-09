import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Aviso from "../../components/Aviso";
import DataTable from "../../components/DataTable";
import { Tag } from "../../components/chat/InfoPanel";
import "../funcionarios/Funcionarios.css";

// shortcut: foraDoPrazo fixo (sem mensagens carregáveis); virá da API junto com os atendimentos.
// shortcut: atendimentos fixos em memória, trocar por useApi (GET atendimentos) quando a API existir.
const ATENDIMENTOS = [
  { id: 1, cliente: "Gabriel Martins", telefone: "(47) 99999-1234", responsavel: "Lucas Oliveira", setor: "Comercial", etapa: "Apresentação de Planos", inicio: "09/11 14:32", status: "Em andamento" },
  { id: 2, cliente: "Mariana Souza", telefone: "(47) 98888-4321", responsavel: "Ana Souza", setor: "Comercial", etapa: "Aguardando decisão", inicio: "09/11 14:10", status: "Em andamento", foraDoPrazo: true },
  { id: 3, cliente: "Pedro Almeida", telefone: "(47) 97777-1111", responsavel: "Pedro Henrique", setor: "Suporte", etapa: "Inicial", inicio: "09/11 13:55", status: "Aguardando", foraDoPrazo: true },
  { id: 4, cliente: "Juliana Costa", telefone: "(47) 96666-2222", responsavel: "Lucas Oliveira", setor: "Comercial", etapa: "Concluído", inicio: "09/11 11:20", status: "Finalizado", foraDoPrazo: true },
];

const COR = { "Em andamento": "azul", Aguardando: "amarela", Finalizado: "" };

const COLUNAS = [
  { chave: "cliente", titulo: "Cliente" },
  { chave: "telefone", titulo: "Telefone" },
  { chave: "responsavel", titulo: "Responsável" },
  { chave: "setor", titulo: "Setor" },
  { chave: "etapa", titulo: "Etapa" },
  { chave: "inicio", titulo: "Início" },
  { chave: "status", titulo: "Status", render: (a) => <Tag cor={COR[a.status]}>{a.status}</Tag> },
];

const Atendimentos = () => {
  const navigate = useNavigate();
  const [foraDoPrazo, setForaDoPrazo] = useState(null);
  const abrir = (a) => (a.foraDoPrazo ? setForaDoPrazo(a) : navigate(`/mensagens/${a.id}`));
  const [busca, setBusca] = useState("");
  const termo = busca.trim().toLowerCase();
  const linhas = ATENDIMENTOS.filter((a) => a.cliente.toLowerCase().includes(termo));

  return (
    <div className="func">
      <header className="func-head">
        <div>
          <h1>Atendimentos</h1>
          <p>{linhas.length} atendimentos</p>
        </div>
        <input
          placeholder="Pesquisar cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ height: 38, padding: "0 12px", border: "1px solid #e2e8f0", borderRadius: 10 }}
        />
      </header>
      {foraDoPrazo && (
        <div style={{ marginBottom: 16 }}>
          <Aviso titulo="Atendimento fora do prazo">
            Não foi possível carregar as mensagens de {foraDoPrazo.cliente}, pois este atendimento está fora do prazo.
          </Aviso>
        </div>
      )}
      <DataTable colunas={COLUNAS} linhas={linhas} onLinhaClick={abrir} vazio="Nenhum atendimento encontrado" />
    </div>
  );
};

export default Atendimentos;
