import { useEffect, useRef } from "react";
import DoneAll from "@mui/icons-material/DoneAll";
import ChatAvatar from "./ChatAvatar";
import "./Chat.css";

// mensagem: { id, texto, hora, meu, remetente, iniciais, cor, ia, lido }
const ChatMessageList = ({ mensagens }) => {
  const fim = useRef(null);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  return (
    <div className="chat-lista">
      {mensagens.map((m) => (
        <div key={m.id} className={`chat-linha${m.meu ? " meu" : ""}${m.ia ? " ia" : ""}`}>
          <ChatAvatar iniciais={m.iniciais} cor={m.cor} />
          <div className="chat-coluna">
            {m.remetente && <span className="chat-remetente">{m.remetente}</span>}
            <div className="chat-balao">{m.texto}</div>
            <span className="chat-hora">
              {m.hora}
              {m.lido && <DoneAll />}
            </span>
          </div>
        </div>
      ))}
      <div ref={fim} />
    </div>
  );
};

export default ChatMessageList;
