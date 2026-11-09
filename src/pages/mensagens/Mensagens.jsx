import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PsychologyOutlined from "@mui/icons-material/PsychologyOutlined";
import Aviso from "../../components/Aviso";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessageList from "../../components/chat/ChatMessageList";
import ChatComposer from "../../components/chat/ChatComposer";
import ConversationList from "../../components/chat/ConversationList";
import ChatAvatar from "../../components/chat/ChatAvatar";
import { InfoPanel, InfoSection, InfoRow, InfoBox, InfoSelect, Tag, TagGroup } from "../../components/chat/InfoPanel";
import "./Mensagens.css";

// shortcut: tudo em memória (conversas, mensagens, ficha da IA); trocar por useApi + websocket quando existirem.
const CONVERSAS = [
  { id: 1, iniciais: "GM", nome: "Gabriel Martins", hora: "14:50", previa: "Gostaria de saber os valores dos ...", naoLidas: 2, responsavel: "Lucas Oliveira", setor: "Comercial", espera: "18min", telefone: "(47) 99999-1234", origem: "Instagram", etapa: "Apresentação de Planos" },
  { id: 2, iniciais: "MS", nome: "Mariana Souza", hora: "14:43", previa: "Vocês possuem natação para adolesc...", naoLidas: 0, responsavel: "Ana Souza", setor: "Comercial", espera: "7min", telefone: "(47) 98888-4321", origem: "Google", etapa: "Aguardando decisão" },
  { id: 3, iniciais: "PA", nome: "Pedro Almeida", hora: "14:47", previa: "Preciso cancelar minha matrícula", naoLidas: 1, responsavel: "Pedro Henrique", setor: "Suporte", espera: "3min", telefone: "(47) 97777-1111", origem: "Facebook", etapa: "Inicial" },
  { id: 4, iniciais: "JC", nome: "Juliana Costa", hora: "11:20", previa: "Vamos fechar! Como faço a matrícula?", naoLidas: 0, responsavel: "Lucas Oliveira", setor: "Comercial", espera: "0min", telefone: "(47) 96666-2222", origem: "LinkedIn", etapa: "Concluído" },
];

const cli = (id, texto, hora) => ({ id, texto, hora, remetente: "Gabriel Martins", iniciais: "G", cor: "cliente" });
const eu = (id, texto, hora) => ({ id, texto, hora, meu: true, iniciais: "LO", cor: "crmuni", lido: true });
const MENSAGENS = [
  cli(1, "Olá, gostaria de saber os valores dos planos disponíveis.", "14:32"),
  { id: 2, texto: "Olá! Claro! Posso te ajudar com os planos disponíveis. 😊", hora: "14:32", remetente: "IA CRMUNI", iniciais: "AI", cor: "ia", ia: true },
  cli(3, "Quero um plano para treinar musculação e gostaria de saber se vocês possuem natação.", "14:35"),
  eu(4, "Olá Gabriel! Temos algumas opções que podem se encaixar no que você procura. Nosso Plano Premium (R$ 149,90/mês) dá acesso a musculação + natação + todas as modalidades. Posso te apresentar os detalhes?", "14:38"),
  cli(5, "Sim! Quero saber mais sobre o Premium. Quais horários a natação está disponível?", "14:40"),
];

// shortcut: opções fixas, trocar pelas listas reais de funis/etapas da API.
const FUNIS = ["Funil de Vendas"];
const ETAPAS = ["Inicial", "Primeiro Contato", "Apresentação de Planos", "Aguardando decisão", "Conversão", "Concluído", "Perdido"];

const Mensagens = () => {
  const [funil, setFunil] = useState(FUNIS[0]);
  const { id } = useParams(); // /mensagens/:id abre direto a conversa (vem da tabela de atendimentos)
  const navigate = useNavigate();
  const conversa = CONVERSAS.find((c) => String(c.id) === id) ?? CONVERSAS[0];
  const ativaId = conversa.id;
  const [etapas, setEtapas] = useState({});
  const [aba, setAba] = useState("Mensagem");
  const [porConversa, setPorConversa] = useState({ 1: MENSAGENS });
  const mensagens = porConversa[ativaId] ?? [];
  const etapa = etapas[ativaId] ?? conversa.etapa;

  const enviar = (texto) =>
    setPorConversa((p) => ({
      ...p,
      [ativaId]: [
        ...(p[ativaId] ?? []),
        eu(crypto.randomUUID(), texto, new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })),
      ],
    }));

  return (
    <div className="msgs">
      <ConversationList conversas={CONVERSAS} ativaId={ativaId} onSelecionar={(i) => navigate(`/mensagens/${i}`)} />

      <section className="msgs-chat">
        <ChatHeader
          iniciais={conversa.iniciais}
          nome={conversa.nome}
          badge="Potencial Cliente"
          telefone={conversa.telefone}
        />
        {mensagens.length === 0 ? (
          <div className="msgs-aviso">
            <Aviso titulo="Atendimento fora do prazo">
              Não foi possível carregar as mensagens, pois este atendimento está fora do prazo.
            </Aviso>
          </div>
        ) : (
          <ChatMessageList mensagens={mensagens} />
        )}
        <ChatComposer abas={["Mensagem", "Anotações internas"]} aba={aba} onAba={setAba} onEnviar={enviar} extras />
      </section>

      <InfoPanel>
        <InfoSection>
          <div className="msgs-cliente">
            <ChatAvatar iniciais={conversa.iniciais} />
            <div>
              <strong>{conversa.nome}</strong>
              <small>● WhatsApp conectado</small>
            </div>
          </div>
          <InfoRow rotulo="Telefone" valor={conversa.telefone} />
          <InfoRow rotulo="Origem" valor={conversa.origem} />
          <InfoRow rotulo="Responsável" valor={conversa.responsavel} />
          <InfoRow rotulo="Setor" valor={conversa.setor} />
          <InfoBox destaque>
            <InfoRow rotulo="Classificação" valor="Potencial Cliente" />
            <InfoSelect rotulo="Funil" valor={funil} opcoes={FUNIS} onChange={setFunil} />
            <InfoSelect rotulo="Etapa" valor={etapa} opcoes={ETAPAS} onChange={(v) => setEtapas((e) => ({ ...e, [ativaId]: v }))} />
          </InfoBox>
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
    </div>
  );
};

export default Mensagens;
