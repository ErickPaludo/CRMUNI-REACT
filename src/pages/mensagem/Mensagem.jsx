import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { formatarTelefone } from "../../utils/formatadores";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessageList from "../../components/chat/ChatMessageList";
import ChatComposer from "../../components/chat/ChatComposer";
import { CHAT_URL, hora, mensagemErro } from "../../hooks/chat";
import "./Mensagem.css";

// ETipoResposta do hub (serializado como número)
const TIPO = { EmAndamento: 0, SelecionarSetor: 1, Aberto: 2, InformarNome: 3 };

// MensagemDto -> formato do ChatMessageList; tipo 0 = ERemetente.Cliente
const doServidor = (m) => ({
  id: m.id,
  hora: hora(m.dataHora),
  meu: m.tipo === 0,
  remetente: m.tipo === 0 ? undefined : m.remetente,
  iniciais: m.tipo === 0 ? "VC" : "CR",
  cor: m.tipo === 0 ? "cliente" : "crmuni",
  texto: m.texto,
});

const sistema = (texto) => ({
  id: crypto.randomUUID(), hora: hora(), remetente: "CRMUNI", iniciais: "CR", cor: "crmuni", texto,
});

// Ainda não gravado no banco (nome / setor): mostra localmente o que o cliente digitou.
const local = (texto) => ({ id: crypto.randomUUID(), hora: hora(), meu: true, iniciais: "VC", cor: "cliente", texto });

const erro = (e) => sistema(mensagemErro(e));

const Mensagem = () => {
  const { telefone: telefoneRota, guidEmpresa } = useParams();
  const [telefone, setTelefone] = useState(telefoneRota?.replace(/\D/g, "") ?? "");
  const [confirmado, setConfirmado] = useState(Boolean(telefoneRota));
  const [mensagens, setMensagens] = useState([]);
  // Etapa atual do fluxo do hub: InformarNome -> SelecionarSetor -> atendimento (idAtendimento)
  const [etapa, setEtapa] = useState(null);
  const [idAtendimento, setIdAtendimento] = useState(null);
  const [encerrado, setEncerrado] = useState(false);
  const hub = useRef(null);

  const add = (...msgs) => setMensagens((m) => [...m, ...msgs]);

  const aplicar = (r) => {
    setEtapa(r.tipo);
    setIdAtendimento(r.idAtendimento);
    if (r.mensagens.length) setMensagens(r.mensagens.map(doServidor));
    // Atendimento retomado: o histórico basta, sem o aviso "Você já possui o atendimento...".
    if (r.tipo !== TIPO.EmAndamento) add(sistema(r.mensagem));
  };

  useEffect(() => {
    if (!confirmado) return;
    const conexao = new HubConnectionBuilder()
      .withUrl(CHAT_URL)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();
    hub.current = conexao;

    conexao.on("ReceberMensagem", (m) => add(doServidor(m)));
    conexao.on("AtendimentoEncerrado", (_, motivo) => {
      setIdAtendimento(null);
      setEtapa(null);
      setEncerrado(true);
      add(sistema(motivo));
    });

    const iniciando = conexao.start();
    iniciando
      // Conexão descartada não solicita atendimento (tomaria o atendimento da conexão que vale).
      .then(() => hub.current === conexao && conexao.invoke("SolicitarAtendimento", guidEmpresa, telefone).then(aplicar))
      .catch((e) => {
        // Conexão descartada pelo cleanup (StrictMode monta o efeito 2x em dev): ignora o erro dela.
        if (hub.current !== conexao) return;
        // Telefone rejeitado pelo servidor: reabre o popup para corrigir.
        if (conexao.state === "Connected") setConfirmado(false);
        add(erro(e));
      });

    return () => {
      if (hub.current === conexao) hub.current = null;
      // Fecha só depois de negociar: parar no meio gera o erro "stopped during negotiation".
      iniciando.catch(() => {}).finally(() => conexao.stop());
    };
  }, [confirmado]); // eslint-disable-line react-hooks/exhaustive-deps

  const enviar = async (texto) => {
    try {
      if (idAtendimento != null) return await hub.current.invoke("EnviarMensagem", idAtendimento, texto);
      add(local(texto));
      if (etapa === TIPO.InformarNome) aplicar(await hub.current.invoke("InformarNome", texto));
      else if (etapa === TIPO.SelecionarSetor) {
        const setor = parseInt(texto, 10);
        if (!setor) return add(sistema("Digite o número do setor: 1, 2 ou 3."));
        aplicar(await hub.current.invoke("SelecionarSetor", setor));
      } else add(sistema("Sem atendimento ativo. Recarregue a página para iniciar outro."));
    } catch (e) {
      add(erro(e));
    }
  };

  const digitos = telefone.replace(/\D/g, "");

  return (
    <div className="chat-pagina">
      <ChatHeader iniciais="CR" nome="CRMUNI" telefone={formatarTelefone(digitos)} />
      <ChatMessageList mensagens={mensagens} />
      <ChatComposer
        onEnviar={enviar}
        bloqueado={encerrado && "Atendimento encerrado. Recarregue a página para iniciar outro."}
      />
      <Dialog open={!confirmado} fullWidth maxWidth="xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTelefone(digitos);
            setConfirmado(true);
          }}
        >
          <DialogTitle>Informe seu celular</DialogTitle>
          <DialogContent sx={{ pt: "8px !important" }}>
            <TextField
              label="Celular (55 + DDD + número)"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              autoFocus
              fullWidth
              required
              slotProps={{ htmlInput: { inputMode: "tel" } }}
            />
          </DialogContent>
          <DialogActions>
            {/* Celular do domínio exige 13 dígitos */}
            <Button type="submit" variant="contained" disabled={digitos.length !== 13}>
              Iniciar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Mensagem;
