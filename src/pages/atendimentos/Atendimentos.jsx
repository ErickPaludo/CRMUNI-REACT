import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Aviso from "../../components/Aviso";
import DataTable from "../../components/DataTable";
import { Tag } from "../../components/chat/InfoPanel";
import { useAtendimentos } from "../../hooks/useAtendimentos";
import "../funcionarios/Funcionarios.css";

// EAtendimentoSituacao da API: 0 Aguardando, 1 EmAndamento, 2 Finalizado
const SITUACAO = { 0: "Aguardando", 1: "Em andamento", 2: "Finalizado" };
const COR_SITUACAO = { 0: "amarela", 1: "azul", 2: "" };
const data = (iso) => new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const COLUNAS = [
  { chave: "id", titulo: "Atendimento", render: (a) => `#${a.id}` },
  { chave: "funil", titulo: "Funil", render: (a) => a.funil?.nome },
  { chave: "etapa", titulo: "Etapa", render: (a) => a.etapa?.nome },
  { chave: "atendente", titulo: "Atendente", render: (a) => a.atendente?.nomeCompleto },
  { chave: "setor", titulo: "Setor", render: (a) => a.atendente?.setor },
  { chave: "inicio", titulo: "Início", render: (a) => data(a.dataCriacao) },
  { chave: "situacao", titulo: "Situação", render: (a) => <Tag cor={COR_SITUACAO[a.situacao] ?? "azul"}>{SITUACAO[a.situacao] ?? `Situação ${a.situacao}`}</Tag> },
];

const Atendimentos = () => {
  const navigate = useNavigate();
  const { atendimentos } = useAtendimentos();
  const [foraDoPrazo, setForaDoPrazo] = useState(null);
  const abrir = (a) => (a.foraDoPrazo ? setForaDoPrazo(a) : navigate(`/mensagens/${a.id}`));
  const [busca, setBusca] = useState("");
  const termo = busca.trim().toLowerCase();
  const linhas = atendimentos.filter((a) =>
    [a.atendente?.nomeCompleto, a.atendente?.setor, a.funil?.nome, a.etapa?.nome].some((t) => t?.toLowerCase().includes(termo)),
  );

  return (
    <div className="func">
      <header className="func-head">
        <div>
          <h1>Atendimentos</h1>
          <p>{linhas.length} atendimentos</p>
        </div>
        <input
          placeholder="Pesquisar atendente, setor, funil ou etapa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ height: 38, padding: "0 12px", border: "1px solid #e2e8f0", borderRadius: 10 }}
        />
      </header>
      {foraDoPrazo && (
        <div style={{ marginBottom: 16 }}>
          <Aviso titulo="Atendimento fora do prazo">
            Não foi possível carregar as mensagens do atendimento #{foraDoPrazo.id}, pois este atendimento está fora do prazo.
          </Aviso>
        </div>
      )}
      <DataTable colunas={COLUNAS} linhas={linhas} onLinhaClick={abrir} vazio="Nenhum atendimento encontrado" />
    </div>
  );
};

export default Atendimentos;
