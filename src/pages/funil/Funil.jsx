import { useState } from "react";
import "./Funil.css";

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
const iniciais = (n) =>
  n
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

const Funil = () => {
  const [filtro, setFiltro] = useState("Todos");
  const lista = NEGOCIACOES.filter(
    (n) => filtro === "Todos" || n.resp === filtro,
  );
  const total = lista.reduce((s, n) => s + n.valor, 0);

  return (
    <div className="funil">
      <header className="funil-head">
        <div>
          <h1>Funil de Vendas</h1>
          <p>
            {lista.length} negociações · {moeda(total)}/mês em potencial
          </p>
        </div>
        <div className="funil-filtros">
          {["Todos", ...RESPONSAVEIS].map((r) => (
            <button
              key={r}
              className={r === filtro ? "ativo" : ""}
              onClick={() => setFiltro(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="funil-board">
        {ETAPAS.map((e) => {
          const cards = lista.filter((n) => n.etapa === e.id);
          const soma = cards.reduce((s, n) => s + n.valor, 0);
          return (
            <section className="funil-col" key={e.id}>
              <h2>
                <i style={{ background: e.cor }} /> {e.nome}
                <b style={{ background: e.cor }}>{cards.length}</b>
              </h2>
              <small>{moeda(soma)}/mês</small>
              {cards.length === 0 && (
                <p className="funil-vazio">Sem negociações</p>
              )}
              {cards.map((n) => (
                <article className="funil-card" key={n.id}>
                  <div className="funil-card-top">
                    <span className="funil-avatar">{iniciais(n.nome)}</span>
                    <div>
                      <strong>{n.nome}</strong>
                      <span>{n.plano}</span>
                    </div>
                  </div>
                  <p className="funil-valor">{moeda(n.valor)}/mês</p>
                  <small>
                    {n.resp} · {n.origem} · {n.tempo}
                  </small>
                  {n.ia && (
                    <em className={`funil-ia ${n.ia[1]}`}>IA: {n.ia[0]}</em>
                  )}
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Funil;
