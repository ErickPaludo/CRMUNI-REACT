import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useAuth } from "../../hooks/useAuth";
import { useAtendimentos } from "../../hooks/useAtendimentos";
import { useFunis } from "../../hooks/useFunis";
import { useEtapas } from "../../hooks/useEtapas";
import { CHAT_URL, hora, iniciais, mensagemErro } from "../../hooks/chat";
import { formatarTelefone } from "../../utils/formatadores";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PsychologyOutlined from "@mui/icons-material/PsychologyOutlined";
import Aviso from "../../components/Aviso";
import CircularProgress from "@mui/material/CircularProgress";
import { rastrear } from "../../hooks/carregamento";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessageList from "../../components/chat/ChatMessageList";
import ChatComposer from "../../components/chat/ChatComposer";
import ConversationList from "../../components/chat/ConversationList";
import ChatAvatar from "../../components/chat/ChatAvatar";
import { InfoPanel, InfoSection, InfoRow, InfoBox, InfoSelect, Tag, TagGroup } from "../../components/chat/InfoPanel";
import "./Mensagens.css";

// Classificação do cliente = tipo do funil da etapa atual (EFunil da API)
const CLASSIFICACAO = { 0: "Curioso", 1: "Potencial Cliente", 2: "Vendido" };
const porOrdem = (a, b) => a.ordem - b.ordem;

// AtendimentoDto do hub -> formato do ConversationList
const daConversa = (a) => ({
  id: a.idAtendimento,
  iniciais: iniciais(a.nomeCliente),
  nome: a.nomeCliente,
  telefone: formatarTelefone(a.telefoneCliente),
  previa: a.clienteConectado ? "● Cliente online" : "Cliente offline",
  naoLidas: 0,
  responsavel: a.nomeFuncionario,
  numero: `nº ${a.idAtendimento}`,
  setor: a.setor,
  espera: a.clienteConectado ? "agora" : "-",
  conectado: a.clienteConectado,
});

// MensagemDto -> formato do ChatMessageList; tipo 1 = ERemetente.Funcionario.
// Administrador (leitura) vê o nome de quem enviou nos dois lados.
const daMensagem = (m, leitura) => ({
  id: m.id,
  texto: m.texto,
  hora: hora(m.dataHora),
  meu: m.tipo === 1,
  remetente: m.tipo === 1 && !leitura ? undefined : m.remetente,
  iniciais: iniciais(m.remetente),
  cor: m.tipo === 1 ? "crmuni" : "cliente",
});

const Mensagens = () => {
  const { funcionario, tokenRef } = useAuth();
  // funcionario === false: Usuário administrador acompanha todas as conversas da empresa, sem enviar.
  // null: login/refresh ainda não respondeu.
  return funcionario == null ? null : <ChatAtendente tokenRef={tokenRef} leitura={!funcionario} />;
};

const ChatAtendente = ({ tokenRef, leitura }) => {
  const { atendimentos: detalhes, recarregar } = useAtendimentos();
  const { funis } = useFunis();
  const { etapas: todasEtapas } = useEtapas();
  const { id } = useParams(); // /mensagens/:id abre direto a conversa (vem da tabela de atendimentos)
  const navigate = useNavigate();
  const [atendimentos, setAtendimentos] = useState([]);
  const conversas = atendimentos.map(daConversa);
  const [erro, setErro] = useState(null);
  const [carregado, setCarregado] = useState(false);
  // Com :id na rota não cai em outra conversa: atendimento finalizado não está na lista e não aceita mensagens.
  const conversa = id ? conversas.find((c) => String(c.id) === id) : conversas[0];
  const ativaId = conversa?.id;
  const [aba, setAba] = useState("Mensagem");
  const [porConversa, setPorConversa] = useState({});
  const mensagens = porConversa[ativaId] ?? [];
  const hub = useRef(null);

  // Etapa salva (a gravada nesta tela tem prioridade até o GET /atendimento recarregar)
  // e rascunho (escolhido nos selects, só grava ao confirmar "Aplicar alteração").
  const [etapaSalva, setEtapaSalva] = useState({});
  const [rascunho, setRascunho] = useState({});
  const idSalvo = etapaSalva[ativaId] ?? detalhes.find((d) => d.id === ativaId)?.etapa?.id;
  const idEtapa = rascunho[ativaId] ?? idSalvo;
  const etapaDe = (idE) => todasEtapas.find((e) => e.id === idE);
  const funilAtual = etapaDe(idEtapa)?.funil;
  const etapasDoFunil = todasEtapas.filter((e) => e.funil.id === funilAtual?.id).sort(porOrdem);
  const classificacao = CLASSIFICACAO[etapaDe(idSalvo)?.funil?.tipo];
  const alterado = idEtapa != null && idEtapa !== idSalvo;
  const [confirmar, setConfirmar] = useState(null); // { titulo, texto, acao }
  // Tira o foco do botão antes de abrir o diálogo: o MUI põe aria-hidden no #root e o navegador
  // bloqueia (e avisa) se o elemento focado ficar escondido.
  const pedirConfirmacao = (e, c) => {
    e.currentTarget.blur();
    setConfirmar(c);
  };

  const escolherEtapa = (idNova) => setRascunho((r) => ({ ...r, [ativaId]: idNova }));

  // Trocar o funil sugere a primeira etapa (menor ordem) do funil escolhido.
  const escolherFunil = (idFunil) => {
    const primeira = todasEtapas.filter((e) => e.funil.id === idFunil).sort(porOrdem)[0];
    if (!primeira) return setErro("O funil escolhido não possui etapas.");
    escolherEtapa(primeira.id);
  };

  // O funil acompanha a etapa: gravar a etapa move o atendimento para o funil dela.
  const aplicar = () =>
    rastrear(hub.current.invoke("AlterarEtapa", ativaId, idEtapa))
      .then(() => {
        setEtapaSalva((e) => ({ ...e, [ativaId]: idEtapa }));
        setRascunho((r) => ({ ...r, [ativaId]: undefined }));
        recarregar();
      })
      .catch((e) => setErro(mensagemErro(e)));

  // Funcionário: EncerrarAtendimento finaliza no banco (definitivo), com o cliente online ou não.
  const finalizar = () =>
    rastrear(hub.current.invoke("EncerrarAtendimento", ativaId).then(() => hub.current.invoke("ListarAtendimentos")))
      .then((l) => {
        setAtendimentos(l);
        recarregar();
        navigate("/mensagens");
      })
      .catch((e) => setErro(mensagemErro(e)));

  const adicionar = (idAtendimento, ...msgs) =>
    setPorConversa((p) => ({ ...p, [idAtendimento]: [...(p[idAtendimento] ?? []), ...msgs] }));

  // Conecta como atendente (JWT na query string) e mantém a lista de atendimentos atualizada pelos eventos.
  useEffect(() => {
    const conexao = new HubConnectionBuilder()
      .withUrl(CHAT_URL, { accessTokenFactory: () => tokenRef.current })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();
    hub.current = conexao;

    const listar = () =>
      rastrear(conexao.invoke("ListarAtendimentos"))
        .then((l) => {
          if (hub.current !== conexao) return;
          setAtendimentos(l);
          setCarregado(true);
        })
        .catch((e) => hub.current === conexao && setErro(mensagemErro(e)));

    conexao.on("ReceberMensagem", (m) => adicionar(m.idAtendimento, daMensagem(m, leitura)));
    conexao.on("AtendimentoIniciado", listar);
    conexao.on("AtendimentoEncerrado", listar);
    conexao.onreconnected(listar);

    const iniciando = conexao.start();
    rastrear(iniciando)
      .then(() => hub.current === conexao && listar())
      .catch((e) => hub.current === conexao && setErro(mensagemErro(e)));

    return () => {
      // StrictMode monta o efeito 2x em dev: a conexão descartada não pode mexer no estado,
      // e só fecha depois de negociar (parar no meio gera o erro "stopped during negotiation").
      if (hub.current === conexao) hub.current = null;
      iniciando.catch(() => {}).finally(() => conexao.stop());
    };
  }, [tokenRef, leitura]);

  // Histórico da conversa aberta (recarrega ao trocar de conversa).
  useEffect(() => {
    if (ativaId == null || hub.current?.state !== "Connected") return;
    rastrear(hub.current.invoke("RetornarMensagens", ativaId))
      .then((l) => setPorConversa((p) => ({ ...p, [ativaId]: l.map((m) => daMensagem(m, leitura)) })))
      .catch((e) => {
        setPorConversa((p) => ({ ...p, [ativaId]: p[ativaId] ?? [] })); // para o carregamento; o erro aparece no aviso
        setErro(mensagemErro(e));
      });
  }, [ativaId, leitura]);

  const enviar = (texto) => {
    // shortcut: anotações internas ficam só em memória; gravar quando a API tiver o endpoint.
    if (aba !== "Mensagem")
      return adicionar(ativaId, { id: crypto.randomUUID(), texto, hora: hora(), meu: true, iniciais: "AN", cor: "ia", remetente: "Anotação interna" });
    hub.current?.invoke("EnviarMensagem", ativaId, texto).catch((e) => setErro(mensagemErro(e)));
  };

  if (!conversa)
    return (
      <div className="msgs">
        {conversas.length > 0 && (
          <ConversationList conversas={conversas} onSelecionar={(i) => navigate(`/mensagens/${i}`)} />
        )}
        <div className="msgs-aviso">
          {erro ? (
            <Aviso titulo="Chat indisponível">{erro}</Aviso>
          ) : !carregado ? (
            <CircularProgress aria-label="Carregando conversas" sx={{ m: "auto" }} />
          ) : id ? (
            <Aviso titulo="Atendimento encerrado">
              O atendimento nº {id} foi finalizado ou não está mais disponível. Não é possível enviar mensagens.
            </Aviso>
          ) : (
            <Aviso tipo="info" titulo="Nenhuma conversa">Você não possui atendimentos em andamento.</Aviso>
          )}
        </div>
      </div>
    );

  return (
    <div className="msgs">
      <ConversationList conversas={conversas} ativaId={ativaId} onSelecionar={(i) => navigate(`/mensagens/${i}`)} />

      <section className="msgs-chat">
        <ChatHeader
          iniciais={conversa.iniciais}
          nome={conversa.nome}
          badge={classificacao}
          telefone={conversa.telefone}
          detalhe={conversa.conectado ? "online" : "offline"}
        />
        {erro && (
          <div style={{ padding: "12px 24px 0" }}>
            <Aviso titulo="Erro no chat">{erro}</Aviso>
          </div>
        )}
        {porConversa[ativaId] ? (
          <ChatMessageList mensagens={mensagens} />
        ) : (
          <div className="msgs-aviso">
            <CircularProgress aria-label="Carregando mensagens" sx={{ m: "auto" }} />
          </div>
        )}
        {leitura ? (
          <ChatComposer onEnviar={enviar} bloqueado="Modo acompanhamento: administradores não enviam mensagens." />
        ) : (
          <ChatComposer abas={["Mensagem", "Anotações internas"]} aba={aba} onAba={setAba} onEnviar={enviar} extras />
        )}
      </section>

      <InfoPanel>
        <InfoSection>
          <div className="msgs-cliente">
            <ChatAvatar iniciais={conversa.iniciais} />
            <div>
              <strong>{conversa.nome}</strong>
              <small>{conversa.conectado ? "● Online no chat" : "Offline"}</small>
            </div>
          </div>
          <InfoRow rotulo="Telefone" valor={conversa.telefone} />
          <InfoRow rotulo="Atendimento" valor={conversa.numero} />
          <InfoRow rotulo="Setor" valor={conversa.setor} />
          <InfoRow rotulo="Responsável" valor={conversa.responsavel} />
          <InfoBox destaque>
            <InfoRow rotulo="Classificação" valor={classificacao ?? "-"} />
            <InfoSelect
              rotulo="Funil"
              valor={funilAtual?.id ?? ""}
              opcoes={funis.map((f) => ({ valor: f.id, rotulo: f.nome }))}
              onChange={(v) => escolherFunil(Number(v))}
              desabilitado={leitura}
            />
            <InfoSelect
              rotulo="Etapa"
              valor={idEtapa ?? ""}
              opcoes={etapasDoFunil.map((e) => ({ valor: e.id, rotulo: e.nome }))}
              onChange={(v) => escolherEtapa(Number(v))}
              desabilitado={leitura}
            />
          </InfoBox>
          {!leitura && (
          <div className="pn-botoes">
            <button
              className="pn-botao azul"
              disabled={!alterado}
              onClick={(e) =>
                pedirConfirmacao(e, {
                  titulo: "Aplicar alteração",
                  texto: `Mover o atendimento ${conversa.numero} para "${funilAtual?.nome} → ${etapaDe(idEtapa)?.nome}"?`,
                  acao: aplicar,
                })
              }
            >
              APLICAR ALTERAÇÃO
            </button>
            <button
              className="pn-botao vermelho"
              onClick={(e) =>
                pedirConfirmacao(e, {
                  titulo: "Finalizar atendimento",
                  texto: `Finalizar o atendimento ${conversa.numero} de ${conversa.nome}? Esta ação é definitiva.`,
                  acao: finalizar,
                })
              }
            >
              FINALIZAR
            </button>
          </div>
          )}
        </InfoSection>

        <InfoSection titulo="IA DO ATENDIMENTO" icone={PsychologyOutlined}>
          <InfoRow rotulo="Intenção identificada" valor={<Tag cor="azul">Solicitação de orçamento</Tag>} />
          <InfoRow rotulo="Nível de interesse" valor={<Tag>Alto</Tag>} />
          <InfoRow rotulo="Produto de interesse" valor="Plano Premium" />
          <InfoBox>
            <strong>Resumo da IA</strong>
            <p>"Cliente deseja iniciar musculação e demonstrou interesse em um plano que também ofereça acesso à natação. Está avaliando valores antes de decidir."</p>
          </InfoBox>
          <TagGroup rotulo="Necessidades" tags={["Musculação", "Natação", "Horários flexíveis"]} />
          <TagGroup rotulo="Dúvidas" tags={["Valor", "Horários", "Modalidades"]} cor="amarela" />
          <TagGroup rotulo="Objeções" tags={["Preço"]} cor="vermelha" />
          <InfoBox destaque>
            <strong><AutoAwesomeOutlined fontSize="inherit" /> Próxima ação recomendada</strong>
            <p>"Apresentar o Plano Premium e destacar benefícios de natação + musculação. Oferecer condição especial por tempo limitado."</p>
          </InfoBox>
          <div className="pn-botoes">
            <button className="pn-botao">SUGESTÃO ACEITA</button>
            <button className="pn-botao icone" aria-label="Editar"><EditOutlined fontSize="small" /></button>
          </div>
          <InfoBox>
            Etapa sugerida pela IA: <strong>Apresentação dos planos</strong>
            <div className="pn-botoes"><button className="pn-botao azul">APLICAR ETAPA</button></div>
          </InfoBox>
        </InfoSection>
      </InfoPanel>

      <Dialog open={!!confirmar} onClose={() => setConfirmar(null)} fullWidth maxWidth="xs">
        <DialogTitle>{confirmar?.titulo}</DialogTitle>
        <DialogContent>{confirmar?.texto}</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmar(null)}>Cancelar</Button>
          <Button
            variant="contained"
            color={confirmar?.titulo === "Finalizar atendimento" ? "error" : "primary"}
            onClick={() => {
              confirmar.acao();
              setConfirmar(null);
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Mensagens;
