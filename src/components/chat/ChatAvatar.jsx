// cor: "crmuni" (azul) | "cliente" (cinza) | "ia" (verde)
const ChatAvatar = ({ iniciais, cor = "crmuni" }) => (
  <div className={`chat-avatar chat-avatar-${cor}`}>{iniciais}</div>
);

export default ChatAvatar;
