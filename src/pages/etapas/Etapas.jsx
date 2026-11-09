import { useState } from "react";
import "../funil/Funil.css";

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

const Etapas = () => {
  const [filtro, setFiltro] = useState("Todas");
  const lista = ETAPAS.filter(
    (e) => filtro === "Todas" || (filtro === "Ativas") === e.ativa,
  );

  return (
    <div className="funil">
      <header className="funil-head">
        <div>
          <h1>Etapas</h1>
          <p>
            {lista.length} etapas em {FUNIS.length} funis
          </p>
        </div>
      </header>

      <div className="funil-board">
        {FUNIS.map((f) => {
          const cards = lista.filter((e) => e.funil === f.id);
          return (
            <section className="funil-col" key={f.id}>
              <h2>
                <i style={{ background: f.cor }} /> {f.nome}
                <b style={{ background: f.cor }}>{cards.length}</b>
              </h2>
              {cards.length === 0 && <p className="funil-vazio">Sem etapas</p>}
              {cards.map((e) => (
                <article className="funil-card" key={e.id}>
                  <div className="funil-card-top">
                    <span className="funil-avatar">{e.id}</span>
                    <div>
                      <strong>{e.nome}</strong>
                      <span>{e.descricao}</span>
                    </div>
                  </div>
                  <small>{e.ativa ? "Ativa" : "Inativa"}</small>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Etapas;
