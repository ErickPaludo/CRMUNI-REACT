import "./Chat.css";

// Blocos reutilizáveis do painel lateral de atendimento.
export const InfoPanel = ({ children }) => <aside className="pn">{children}</aside>;

export const InfoSection = ({ titulo, icone: Icone, children }) => (
  <section className="pn-secao">
    {titulo && (
      <h3 className="pn-titulo">
        {Icone && <Icone />}
        {titulo}
      </h3>
    )}
    {children}
  </section>
);

export const InfoRow = ({ rotulo, valor }) => (
  <div className="pn-linha">
    <span>{rotulo}</span>
    <span>{valor}</span>
  </div>
);

// cor: "" (verde) | "amarela" | "vermelha" | "azul"
export const Tag = ({ cor = "", children }) => <span className={`pn-tag ${cor}`}>{children}</span>;

export const TagGroup = ({ rotulo, tags, cor }) => (
  <>
    <div className="pn-rotulo">{rotulo}</div>
    <div className="pn-tags">
      {tags.map((t) => (
        <Tag key={t} cor={cor}>{t}</Tag>
      ))}
    </div>
  </>
);

export const InfoBox = ({ destaque, children }) => (
  <div className={`pn-caixa${destaque ? " destaque" : ""}`}>{children}</div>
);

export const InfoSelect = ({ rotulo, valor, opcoes, onChange }) => (
  <label className="pn-select">
    <span>{rotulo}</span>
    <select value={valor} onChange={(e) => onChange(e.target.value)}>
      {opcoes.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </label>
);
