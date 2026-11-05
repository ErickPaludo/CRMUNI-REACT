import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { formatarTelefone } from "../../utils/formatadores";
import "./Mensagem.css";

const hoje = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const Mensagem = () => {
  // shortcut: guidEmpresa ainda não é usado; entrará na conexão do websocket
  const { telefone, guidEmpresa } = useParams();
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const fim = useRef(null);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // TODO: websocket — chamar receber({ autor: "crmuni", texto }) ao chegar mensagem
  const receber = (msg) =>
    setMensagens((m) => [...m, { id: crypto.randomUUID(), hora: hoje(), ...msg }]);

  const enviar = (e) => {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    receber({ autor: "cliente", texto: t });
    // TODO: websocket — enviar `t` pelo socket
    setTexto("");
  };

  return (
    <div className="chat-pagina">
      <header className="chat-header">
        <div className="chat-avatar chat-avatar-crmuni">CR</div>
        <div>
          <div className="chat-nome">CRMUNI</div>
          <div className="chat-telefone">{formatarTelefone(telefone)}</div>
        </div>
      </header>

      <div className="chat-lista">
        {mensagens.map((m) => {
          const meu = m.autor === "cliente";
          return (
            <div key={m.id} className={`chat-linha ${meu ? "meu" : ""}`}>
              <div className={`chat-avatar ${meu ? "chat-avatar-cliente" : "chat-avatar-crmuni"}`}>
                {meu ? "VC" : "CR"}
              </div>
              <div className="chat-coluna">
                {!meu && <span className="chat-remetente">CRMUNI</span>}
                <div className="chat-balao">{m.texto}</div>
                <span className="chat-hora">{m.hora}</span>
              </div>
            </div>
          );
        })}
        <div ref={fim} />
      </div>

      <form className="chat-envio" onSubmit={enviar}>
        <input
          className="chat-input"
          placeholder="Digite uma mensagem..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <IconButton type="submit" className="chat-enviar" aria-label="Enviar" disabled={!texto.trim()}>
          <SendIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default Mensagem;
