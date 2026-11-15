import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AccessTime from "@mui/icons-material/AccessTime";
import TrendingUp from "@mui/icons-material/TrendingUp";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import ShowChart from "@mui/icons-material/ShowChart";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Aviso from "../../components/Aviso";
import { useAtendimentos } from "../../hooks/useAtendimentos";
import { useEtapas } from "../../hooks/useEtapas";
import { useFunis } from "../../hooks/useFunis";
import { useUsuario } from "../../hooks/useUsuario";
import "../funcionarios/Funcionarios.css";
import "./Home.css";

// Enums da API: EAtendimentoSituacao, EEtapa, EFunil
const AGUARDANDO = 0, FINALIZADO = 2;
const CONCLUIDO = 5, PERDIDO = 7;
const VENDIDO = 2;
// Etapas do funil de vendas, na ordem (Feedback/Perdido ficam fora)
const NOMES_ETAPA = ["Inicial", "Primeiro contato", "Apresentação", "Ag. decisão", "Conversão", "Concluído"];
const PERIODOS = [
  { rotulo: "Hoje", dias: 1 },
  { rotulo: "7 dias", dias: 7 },
  { rotulo: "30 dias", dias: 30 },
];
const DIA = 864e5;
const inicioDoDia = (d) => new Date(d).setHours(0, 0, 0, 0);
const pct = (v, total) => (total ? `${((v / total) * 100).toFixed(1).replace(".0", "")}%` : "0%");
const saudacao = () => (new Date().getHours() < 12 ? "Bom dia" : new Date().getHours() < 18 ? "Boa tarde" : "Boa noite");

const contar = (lista, rotulo) =>
  Object.entries(Object.groupBy(lista, (a) => rotulo(a) ?? "Sem informação")).map(([label, itens]) => ({ id: label, label, value: itens.length }));

const Kpi = ({ icone: Icone, cor, valor, rotulo, detalhe }) => (
  <div className="func-card dash-kpi">
    <span className={`dash-kpi-icone ${cor}`}><Icone fontSize="small" /></span>
    <strong>{valor}</strong>
    <span>{rotulo}</span>
    {detalhe && <small>{detalhe}</small>}
  </div>
);

const Card = ({ titulo, extra, children, className = "" }) => (
  <section className={`func-card dash-card ${className}`}>
    <header>
      <h2>{titulo}</h2>
      {extra && <small>{extra}</small>}
    </header>
    {children}
  </section>
);

const Home = () => {
  const { atendimentos, recarregar } = useAtendimentos();
  const { etapas, recarregar: recarregarEtapas } = useEtapas();
  const { funis, recarregar: recarregarFunis } = useFunis();
  const { usuario } = useUsuario();
  useEffect(recarregar, [recarregar]); // GET /atendimento ao abrir o dashboard
  useEffect(recarregarEtapas, [recarregarEtapas]);
  useEffect(recarregarFunis, [recarregarFunis]);
  const [dias, setDias] = useState(7);

  // o atendimento só traz id/nome de etapa e funil; o tipo vem das listas
  const tipoEtapa = new Map(etapas.map((e) => [e.id, e.tipo]));
  const tipoFunil = new Map(funis.map((f) => [f.id, f.tipo]));
  const etapaDe = (a) => tipoEtapa.get(a.etapa?.id);
  const ehVenda = (a) => etapaDe(a) === CONCLUIDO && tipoFunil.get(a.funil?.id) === VENDIDO;

  const [hoje] = useState(() => inicioDoDia(Date.now())); // fixo enquanto a tela está aberta
  const desde = hoje - (dias - 1) * DIA;
  // shortcut: a API não tem data de conclusão, então a venda conta no dia em que o atendimento foi criado
  const lista = atendimentos.filter((a) => inicioDoDia(a.dataCriacao) >= desde);
  const ativos = lista.filter((a) => a.situacao !== FINALIZADO);
  const vendas = lista.filter(ehVenda);

  // Vendas por dia (mínimo 7 dias no gráfico para a linha fazer sentido)
  const diasGrafico = Array.from({ length: Math.max(dias, 7) }, (_, i) => hoje - (Math.max(dias, 7) - 1 - i) * DIA);
  const vendasDia = diasGrafico.map((d) => atendimentos.filter((a) => ehVenda(a) && inicioDoDia(a.dataCriacao) === d).length);

  // Vendas x atendimentos por vendedor
  const vendedores = Object.entries(Object.groupBy(lista.filter((a) => a.atendente), (a) => a.atendente.nomeCompleto)).sort(
    (x, y) => y[1].length - x[1].length,
  );

  const setores = contar(lista, (a) => a.atendente?.setor).sort((x, y) => y.value - x.value);

  // Funil: quantos chegaram em cada etapa (quem está numa etapa passou pelas anteriores; Perdido não conta)
  const tipos = lista.map(etapaDe).filter((t) => t !== undefined && t !== PERDIDO);
  const funil = NOMES_ETAPA.map((nome, tipo) => ({ nome, qtd: tipos.filter((t) => t >= tipo).length }));
  const passagens = funil.slice(1).map((e, i) => ({ de: funil[i].nome, para: e.nome, taxa: funil[i].qtd ? e.qtd / funil[i].qtd : 1 }));
  const pior = passagens.reduce((p, x) => (x.taxa < p.taxa ? x : p), passagens[0]);

  return (
    <div className="func">
      <header className="func-head">
        <div>
          <h1>{saudacao()}{usuario?.primeiroNome ? `, ${usuario.primeiroNome}` : ""} 👋</h1>
          <p>Veja o desempenho da sua operação.</p>
        </div>
        <div className="dash-periodos" role="group" aria-label="Período">
          {PERIODOS.map((p) => (
            <button key={p.dias} className={dias === p.dias ? "ativo" : ""} aria-pressed={dias === p.dias} onClick={() => setDias(p.dias)}>
              {p.rotulo}
            </button>
          ))}
        </div>
      </header>

      <div className="dash-kpis">
        <Kpi icone={ChatBubbleOutline} cor="azul" valor={ativos.length} rotulo="Atendimentos ativos" />
        <Kpi icone={AccessTime} cor="laranja" valor={lista.filter((a) => a.situacao === AGUARDANDO).length} rotulo="Aguardando" detalhe="precisam de atenção" />
        <Kpi icone={TrendingUp} cor="roxo" valor={lista.length} rotulo="Leads no funil" />
        <Kpi icone={ShoppingBagOutlined} cor="verde" valor={vendas.length} rotulo="Vendas no período" />
        <Kpi icone={ShowChart} cor="ciano" valor={pct(vendas.length, lista.length)} rotulo="Taxa de conversão" />
      </div>

      <div className="dash-linha">
        <Card titulo="Vendas por dia" extra={`últimos ${diasGrafico.length} dias`}>
          <LineChart
            xAxis={[{ scaleType: "point", data: diasGrafico.map((d) => new Date(d).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" })) }]}
            // monotoneX não passa do maior valor (a "natural" ultrapassa e era cortada no topo)
            yAxis={[{ tickMinStep: 1 }]}
            series={[{ data: vendasDia, label: "Vendas", area: true, curve: "monotoneX", color: "#2563eb" }]}
            hideLegend
            height={240}
            margin={{ top: 10, left: 10, right: 10 }} // escala "point" põe o 1º e o último dia na borda; o rótulo precisa de folga
          />
        </Card>
        <Card titulo="Funis ocupados">
          {ativos.length ? (
            <PieChart
              series={[{
                data: contar(ativos, (a) => a.funil?.nome),
                innerRadius: 50,
                paddingAngle: 1,
                cornerRadius: 4,
                arcLabel: (d) => pct(d.value, ativos.length),
                arcLabelMinAngle: 20,
                valueFormatter: (d) => `${d.value} (${pct(d.value, ativos.length)})`,
              }]}
              height={240}
            />
          ) : (
            <p className="dash-vazio">Sem dados</p>
          )}
        </Card>
      </div>

      <div className="dash-linha meio">
        <Card titulo="Vendas por vendedor">
          {vendedores.length ? (
            <BarChart
              xAxis={[{ scaleType: "band", data: vendedores.map(([nome]) => nome.split(" ")[0]) }]}
              series={[
                { data: vendedores.map(([, l]) => l.filter(ehVenda).length), label: "Vendas", color: "#2563eb" },
                { data: vendedores.map(([, l]) => l.length), label: "Atendimentos", color: "#dbeafe" },
              ]}
              height={240}
            />
          ) : (
            <p className="dash-vazio">Sem dados</p>
          )}
        </Card>
        <Card titulo="Atendimentos por setor">
          {setores.length ? (
            <BarChart
              layout="horizontal"
              yAxis={[{ scaleType: "band", data: setores.map((s) => s.label), width: 90 }]}
              series={[{ data: setores.map((s) => s.value), label: "Atendimentos", color: "#7c3aed" }]}
              hideLegend
              height={240}
            />
          ) : (
            <p className="dash-vazio">Sem dados</p>
          )}
        </Card>
      </div>

      <Card titulo="Onde estamos perdendo vendas?" extra="Análise do funil">
        <ol className="dash-funil">
          {funil.map((e, i) => (
            <li key={e.nome}>
              {i > 0 && (
                <span className={`dash-seta ${passagens[i - 1] === pior && funil[0].qtd ? "pior" : ""}`}>
                  <ArrowForward fontSize="small" />
                  {pct(passagens[i - 1].taxa, 1)}
                </span>
              )}
              <div className="dash-etapa" style={{ "--forca": 1 - i * 0.15 }}>
                <strong>{e.qtd}</strong>
                <span>{e.nome}</span>
              </div>
            </li>
          ))}
        </ol>
        {funil[0].qtd > 0 && (
          <Aviso titulo={`A maior perda acontece entre ${pior.de} e ${pior.para}`}>
            Só {pct(pior.taxa, 1)} dos atendimentos em {pior.de} avançam para {pior.para}.
          </Aviso>
        )}
      </Card>
    </div>
  );
};

export default Home;
