import "./DataTable.css";

// colunas: [{ chave, titulo, render? }]; linhas precisam de `id`.
const DataTable = ({ colunas, linhas, vazio = "Nenhum registro", onLinhaClick }) => (
  <div className="dt-wrap">
    <table className="dt">
      <thead>
        <tr>
          {colunas.map((c) => (
            <th key={c.chave}>{c.titulo}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.length === 0 && (
          <tr>
            <td className="dt-vazio" colSpan={colunas.length}>{vazio}</td>
          </tr>
        )}
        {linhas.map((l) => (
          <tr key={l.id} className={onLinhaClick ? "dt-clicavel" : undefined} onClick={() => onLinhaClick?.(l)}>
            {colunas.map((c) => (
              <td key={c.chave}>{c.render ? c.render(l) : l[c.chave]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
