import { useState } from "react";
import { useParams } from "react-router-dom";
import { formatarTelefone } from "../../utils/formatadores";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessageList from "../../components/chat/ChatMessageList";
import ChatComposer from "../../components/chat/ChatComposer";
import "./Mensagem.css";

const hoje = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const Mensagem = () => {
  // shortcut: guidEmpresa ainda não é usado; entrará na conexão do websocket
  const { telefone, guidEmpresa } = useParams();
  const [mensagens, setMensagens] = useState([]);

  // TODO: websocket — chamar receber({ meu: false, remetente: "CRMUNI", iniciais: "CR", cor: "crmuni", texto }) ao chegar mensagem
  const receber = (msg) =>
    setMensagens((m) => [...m, { id: crypto.randomUUID(), hora: hoje(), ...msg }]);

  const enviar = (texto) => {
    receber({ meu: true, iniciais: "VC", cor: "cliente", texto });
    // TODO: websocket — enviar `texto` pelo socket
  };

  return (
    <div className="chat-pagina">
      <ChatHeader iniciais="CR" nome="CRMUNI" telefone={formatarTelefone(telefone)} />
      <ChatMessageList mensagens={mensagens} />
      <ChatComposer onEnviar={enviar} />
    </div>
  );
};

export default Mensagem;
