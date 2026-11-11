import { useState } from "react";
import AccessTime from "@mui/icons-material/AccessTime";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ChatAvatar from "./ChatAvatar";
import "./Chat.css";

// conversa: { id, iniciais, nome, hora, previa, naoLidas, responsavel, setor, espera }
const ConversationList = ({ conversas, ativaId, onSelecionar }) => {
  const [busca, setBusca] = useState("");
  const [setor, setSetor] = useState("");
  const termo = busca.trim().toLowerCase();
  const setores = [...new Set(conversas.map((c) => c.setor).filter(Boolean))].sort();
  const visiveis = conversas.filter((c) => c.nome.toLowerCase().includes(termo) && (!setor || c.setor === setor));

  return (
  <aside className="cv-lista">
    <h2 className="cv-titulo">
      Conversas <span>{conversas.length}</span>
    </h2>
    <div className="cv-busca">
      <SearchOutlined fontSize="small" />
      <input placeholder="Pesquisar contatos..." value={busca} onChange={(e) => setBusca(e.target.value)} />
    </div>
    <div className="cv-busca">
      <select aria-label="Setor" value={setor} onChange={(e) => setSetor(e.target.value)}>
        <option value="">Todos os setores</option>
        {setores.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
    {visiveis.length === 0 && <p className="cv-vazio">Nenhum contato encontrado</p>}
    {visiveis.map((c) => (
      <button key={c.id} className={`cv-item${c.id === ativaId ? " ativa" : ""}`} onClick={() => onSelecionar(c.id)}>
        <ChatAvatar iniciais={c.iniciais} />
        <div className="cv-corpo">
          <div className="cv-linha">
            <strong>{c.nome}</strong>
            <time>{c.hora}</time>
            {c.naoLidas > 0 && <b className="cv-nao-lidas">{c.naoLidas}</b>}
          </div>
          <p>{c.previa}</p>
          <small>
            {c.responsavel} · {c.setor} · <AccessTime /> {c.espera}
          </small>
        </div>
      </button>
    ))}
  </aside>
  );
};

export default ConversationList;
