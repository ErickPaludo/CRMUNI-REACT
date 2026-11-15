import { useState } from "react";
import Popover from "@mui/material/Popover";
import CloseIcon from "@mui/icons-material/Close";
import "./Chat.css";

// Mensagens salvas pelo funcionário (localStorage, uma lista por funcionário); um clique envia.
// shortcut: fica só neste navegador; mover para a API se precisar valer em outros dispositivos.
const ler = (chave) => {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? [];
  } catch {
    return [];
  }
};

const MensagensRapidas = ({ idFuncionario, onEnviar }) => {
  const chave = `crmuni:mensagens-rapidas:${idFuncionario}`;
  const [lista, setLista] = useState(() => ler(chave));
  const [ancora, setAncora] = useState(null);
  const [nova, setNova] = useState("");

  const gravar = (l) => {
    setLista(l);
    try {
      localStorage.setItem(chave, JSON.stringify(l));
    } catch {
      // armazenamento bloqueado: a lista vale só até recarregar a página
    }
  };

  const adicionar = (e) => {
    e.preventDefault();
    const t = nova.trim();
    if (!t) return;
    gravar([...lista, t]);
    setNova("");
  };

  const enviar = (t) => {
    onEnviar(t);
    setAncora(null);
  };

  return (
    <>
      <button type="button" className="chat-aba" onClick={(e) => setAncora(e.currentTarget)}>
        Mensagens rápidas
      </button>
      <Popover
        open={!!ancora}
        anchorEl={ancora}
        onClose={() => setAncora(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <div className="rapidas">
          {!lista.length && <p className="rapidas-vazio">Nenhuma mensagem salva.</p>}
          {lista.map((t, i) => (
            <div className="rapidas-item" key={i}>
              <button type="button" className="rapidas-texto" title="Enviar" onClick={() => enviar(t)}>
                {t}
              </button>
              <button
                type="button"
                className="rapidas-remover"
                aria-label="Remover mensagem"
                onClick={() => gravar(lista.filter((_, j) => j !== i))}
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
          ))}
          <form className="rapidas-nova" onSubmit={adicionar}>
            <textarea
              rows={2}
              maxLength={1000}
              placeholder="Nova mensagem..."
              aria-label="Nova mensagem rápida"
              value={nova}
              onChange={(e) => setNova(e.target.value)}
            />
            <button type="submit" className="chat-aba ativa" disabled={!nova.trim()}>
              Salvar
            </button>
          </form>
        </div>
      </Popover>
    </>
  );
};

export default MensagensRapidas;
