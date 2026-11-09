const BoardColumn = ({ nome, cor, total, quantidade, vazio, children }) => (
  <section className="funil-col">
    <h2>
      <i style={{ background: cor }} /> {nome}
      <b style={{ background: cor }}>{quantidade}</b>
    </h2>
    {total && <small>{total}</small>}
    {quantidade === 0 && <p className="funil-vazio">{vazio}</p>}
    {children}
  </section>
);

export default BoardColumn;
