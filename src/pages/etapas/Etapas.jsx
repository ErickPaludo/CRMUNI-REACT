import Board from "../../components/board/Board";
import BoardColumn from "../../components/board/BoardColumn";
import BoardCard from "../../components/board/BoardCard";

const FUNIS = [
  { id: "inicial", nome: "Inicial", cor: "#2563eb" },
  { id: "primeiroContato", nome: "Primeiro Contato", cor: "#059669" },
  { id: "apresentacaoPlanos", nome: "Apresentação de Planos", cor: "#d5d83d" },
  { id: "aguardandoDecisao", nome: "Aguardando decisão", cor: "#949997" },
  { id: "conversao", nome: "Conversão", cor: "#1f85c0" },
  { id: "concluido", nome: "Concluído", cor: "#189114" },
  { id: "perdido", nome: "Perdido", cor: "#df0808" },
];

const ETAPAS = [];

const Etapas = () => (
  <Board titulo="Etapas" subtitulo={`${ETAPAS.length} etapas em ${FUNIS.length} funis`}>
    {FUNIS.map((f) => {
      const cards = ETAPAS.filter((e) => e.funil === f.id);
      return (
        <BoardColumn key={f.id} nome={f.nome} cor={f.cor} quantidade={cards.length} vazio="Sem etapas">
          {cards.map((e) => (
            <BoardCard key={e.id} avatar={e.id} titulo={e.nome} subtitulo={e.descricao}>
              <small>{e.ativa ? "Ativa" : "Inativa"}</small>
            </BoardCard>
          ))}
        </BoardColumn>
      );
    })}
  </Board>
);

export default Etapas;
