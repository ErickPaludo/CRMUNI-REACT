import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import ChatAvatar from "./ChatAvatar";
import "./Chat.css";

const ChatHeader = ({ iniciais, cor, nome, badge, telefone, detalhe }) => (
  <header className="chat-header">
    <ChatAvatar iniciais={iniciais} cor={cor} />
    <div>
      <div className="chat-nome">
        {nome}
        {badge && <span className="chat-badge">{badge}</span>}
      </div>
      <div className="chat-telefone">
        {telefone && <PhoneOutlined />}
        {telefone}
        {detalhe && <span> · {detalhe}</span>}
      </div>
    </div>
  </header>
);

export default ChatHeader;
