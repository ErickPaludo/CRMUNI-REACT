// Endereço do hub SignalR (CRMUNI.UI.Chat) e utilitários compartilhados pelas telas de chat.
export const CHAT_URL = import.meta.env.VITE_CHAT_URL ?? "https://crmunichat.pldprojects.com.br/hubs/chat";
//export const CHAT_URL = import.meta.env.VITE_CHAT_URL ?? "http://localhost:5090/hubs/chat";

export const hora = (d) =>
  new Date(d ?? Date.now()).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export const iniciais = (nome = "") =>
  nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");

// Texto da HubException sem o prefixo técnico do SignalR.
export const mensagemErro = (e) => e.message.replace(/^.*HubException: /, "");
