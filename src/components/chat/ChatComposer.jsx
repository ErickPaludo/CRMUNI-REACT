import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import AttachFile from "@mui/icons-material/AttachFile";
import EmojiEmotionsOutlined from "@mui/icons-material/EmojiEmotionsOutlined";
import MicNone from "@mui/icons-material/MicNone";
import "./Chat.css";

// abas/aba/onAba e extras são opcionais: a tela do cliente usa só o campo + enviar.
// bloqueado: texto do motivo; desativa o campo (ex.: atendimento encerrado).
const ChatComposer = ({ onEnviar, abas, aba, onAba, extras = false, bloqueado }) => {
  const [texto, setTexto] = useState("");

  const enviar = (e) => {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    onEnviar(t);
    setTexto("");
  };

  return (
    <>
      {abas && (
        <div className="chat-abas">
          {abas.map((a) => (
            <button key={a} type="button" className={`chat-aba${a === aba ? " ativa" : ""}`} onClick={() => onAba(a)}>
              {a}
            </button>
          ))}
        </div>
      )}
      <form className="chat-envio" onSubmit={enviar}>
        <div className="chat-campo">
          <input
            className="chat-input"
            placeholder={bloqueado || "Digite uma mensagem..."}
            disabled={!!bloqueado}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          {extras && (
            <span className="chat-extras">
              <AttachFile fontSize="small" />
              <EmojiEmotionsOutlined fontSize="small" />
              <MicNone fontSize="small" />
            </span>
          )}
        </div>
        <IconButton type="submit" className="chat-enviar" aria-label="Enviar" disabled={!!bloqueado || !texto.trim()}>
          <SendIcon />
        </IconButton>
      </form>
    </>
  );
};

export default ChatComposer;
