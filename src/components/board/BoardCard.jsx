const iniciais = (n) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

const BoardCard = ({ avatar, titulo, subtitulo, children }) => (
  <article className="funil-card">
    <div className="funil-card-top">
      <span className="funil-avatar">{avatar ?? iniciais(titulo)}</span>
      <div>
        <strong>{titulo}</strong>
        <span>{subtitulo}</span>
      </div>
    </div>
    {children}
  </article>
);

export default BoardCard;
