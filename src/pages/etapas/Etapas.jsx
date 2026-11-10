import CircularProgress from "@mui/material/CircularProgress";
import Board from "../../components/board/Board";
import BoardColumn from "../../components/board/BoardColumn";
import BoardCard from "../../components/board/BoardCard";
import { useEtapas } from "../../hooks/useEtapas";

// uma coluna por `tipo` de etapa (o tipo 6 não existe na API; Perdido é 7)
const COLUNAS = [
  { tipo: 0, nome: "Inicial", cor: "#2563eb" },
  { tipo: 1, nome: "Primeiro Contato", cor: "#059669" },
  { tipo: 2, nome: "Apresentação de Planos", cor: "#d5d83d" },
  { tipo: 3, nome: "Aguardando decisão", cor: "#949997" },
  { tipo: 4, nome: "Conversão", cor: "#1f85c0" },
  { tipo: 5, nome: "Concluído", cor: "#189114" },
  { tipo: 7, nome: "Perdido", cor: "#df0808" },
];

const Etapas = () => {
  const { etapas, carregando } = useEtapas();

  if (carregando) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: 48 }}>
        <CircularProgress aria-label="Carregando etapas" />
      </div>
    );
  }

  const funis = new Set(etapas.map((e) => e.funil?.id)).size;
  return (
    <Board
      titulo="Etapas"
      subtitulo={`${new Set(etapas.map((e) => e.tipo)).size} etapas em ${funis} funis`}
    >
      {COLUNAS.map((c) => {
        const cards = etapas
          .filter((e) => e.tipo === c.tipo)
          .sort((a, b) => a.funil.id - b.funil.id);
        return (
          <BoardColumn
            key={c.tipo}
            nome={c.nome}
            cor={c.cor}
            quantidade={cards.length}
            vazio="Sem etapas"
          ></BoardColumn>
        );
      })}
    </Board>
  );
};

export default Etapas;
