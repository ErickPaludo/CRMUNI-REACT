import CircularProgress from "@mui/material/CircularProgress";
import { useFunis } from "../../hooks/useFunis";
import Board from "../../components/board/Board";
import BoardColumn from "../../components/board/BoardColumn";
import BoardCard from "../../components/board/BoardCard";

// shortcut: dados fixos em memória, trocar por useApi (GET negociações) quando a API existir.
const ETAPAS = [
  { id: "curioso", nome: "Curioso", cor: "#6b7280" },
  { id: "potencialCliente", nome: "Potencial Cliente", cor: "#7c3aed" },
  { id: "vendido", nome: "Vendido", cor: "#2563eb" },
];

const NEGOCIACOES = [
  {
    id: 1,
    etapa: "inicial",
    nome: "Camila Oliveira",
    plano: "Plano Básico",
    valor: 99.9,
    resp: "Lucas",
    origem: "YouTube",
    tempo: "45min",
  },
];

const moeda = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Funil = () => {
  const { funis, carregando } = useFunis();
  const funil = funis[0]; // shortcut: usa o primeiro funil; seletor de funil quando for preciso
  // shortcut: assume funil.etapas [{id, nome, cor}]; sem elas cai nas etapas fixas
  const etapas = funil?.etapas?.length ? funil.etapas : ETAPAS;

  if (carregando) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: 48 }}>
        <CircularProgress aria-label="Carregando funis" />
      </div>
    );
  }

  return (
    <Board titulo={funil?.nome ?? "Funil de Vendas"}>
      {etapas.map((e) => {
        const cards = NEGOCIACOES.filter((n) => n.etapa === e.id);
        return (
          <BoardColumn
            key={e.id}
            nome={e.nome}
            cor={e.cor}
            quantidade={cards.length}
            vazio="Sem negociações"
          >
            {cards.map((n) => (
              <BoardCard key={n.id} titulo={n.nome} subtitulo={n.plano}>
                <p className="funil-valor">{moeda(n.valor)}/mês</p>
                <small>
                  {n.resp} · {n.origem} · {n.tempo}
                </small>
                {n.ia && (
                  <em className={`funil-ia ${n.ia[1]}`}>IA: {n.ia[0]}</em>
                )}
              </BoardCard>
            ))}
          </BoardColumn>
        );
      })}
    </Board>
  );
};

export default Funil;
