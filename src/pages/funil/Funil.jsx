import { useState } from "react";
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

const RESPONSAVEIS = ["Lucas", "Ana", "Pedro", "Fernanda"];
const moeda = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const soma = (l) => l.reduce((s, n) => s + n.valor, 0);

const Funil = () => {
  const [filtro, setFiltro] = useState("Todos");
  const lista = NEGOCIACOES.filter(
    (n) => filtro === "Todos" || n.resp === filtro,
  );

  return (
    <Board
      titulo="Funil de Vendas"
      subtitulo={`${lista.length} negociações · ${moeda(soma(lista))}/mês em potencial`}
      filtros={["Todos", ...RESPONSAVEIS]}
      filtro={filtro}
      onFiltro={setFiltro}
    >
      {ETAPAS.map((e) => {
        const cards = lista.filter((n) => n.etapa === e.id);
        return (
          <BoardColumn
            key={e.id}
            nome={e.nome}
            cor={e.cor}
            quantidade={cards.length}
            total={`${moeda(soma(cards))}/mês`}
            vazio="Sem negociações"
          >
            {cards.map((n) => (
              <BoardCard key={n.id} titulo={n.nome} subtitulo={n.plano}>
                <p className="funil-valor">{moeda(n.valor)}/mês</p>
                <small>
                  {n.resp} · {n.origem} · {n.tempo}
                </small>
                {n.ia && <em className={`funil-ia ${n.ia[1]}`}>IA: {n.ia[0]}</em>}
              </BoardCard>
            ))}
          </BoardColumn>
        );
      })}
    </Board>
  );
};

export default Funil;
