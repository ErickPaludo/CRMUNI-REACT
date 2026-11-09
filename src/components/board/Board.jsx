import { useRef, useState } from "react";
import "./Board.css";

// Cabeçalho (título, subtítulo, filtros) + quadro de colunas que rola arrastando com o mouse.
const Board = ({ titulo, subtitulo, filtros = [], filtro, onFiltro, children }) => {
  const ref = useRef(null);
  const drag = useRef(null);
  const [arrastando, setArrastando] = useState(false);

  const onDown = (e) => {
    drag.current = { x: e.clientX, left: ref.current.scrollLeft };
    ref.current.setPointerCapture(e.pointerId);
    setArrastando(true);
  };
  const onMove = (e) => {
    if (drag.current) ref.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onUp = () => {
    drag.current = null;
    setArrastando(false);
  };

  return (
    <div className="funil">
      <header className="funil-head">
        <div>
          <h1>{titulo}</h1>
          <p>{subtitulo}</p>
        </div>
        {filtros.length > 0 && (
          <div className="funil-filtros">
            {filtros.map((f) => (
              <button key={f} className={f === filtro ? "ativo" : ""} onClick={() => onFiltro(f)}>
                {f}
              </button>
            ))}
          </div>
        )}
      </header>

      <div
        ref={ref}
        className={`funil-board${arrastando ? " arrastando" : ""}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {children}
      </div>
    </div>
  );
};

export default Board;
