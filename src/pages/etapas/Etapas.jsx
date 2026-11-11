import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Board from "../../components/board/Board";
import BoardColumn from "../../components/board/BoardColumn";
import BoardCard from "../../components/board/BoardCard";
import { useFiltroAtendimentos } from "../../components/board/useFiltroAtendimentos";
import { useEtapas } from "../../hooks/useEtapas";
import { useAtendimentos } from "../../hooks/useAtendimentos";

const CORES = ["#2563eb", "#059669", "#d5d83d", "#949997", "#1f85c0", "#189114", "#7c3aed", "#df0808"]; // por `tipo` da etapa

const Etapas = () => {
  const { etapas, carregando: carregandoEtapas } = useEtapas();
  const { atendimentos: todos, carregando: carregandoAtend, recarregar } = useAtendimentos();
  useEffect(recarregar, [recarregar]); // busca de novo ao entrar na tela
  const { filtrados: atendimentos, filtros } = useFiltroAtendimentos(todos);

  if (carregandoEtapas || carregandoAtend) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: 48 }}>
        <CircularProgress aria-label="Carregando etapas" />
      </div>
    );
  }

  // agrupa as etapas de todos os funis por tipo: uma coluna por etapa, com os atendimentos de qualquer funil
  const grupos = [...Map.groupBy(etapas, (e) => e.tipo)].sort((x, y) => x[0] - y[0]);
  return (
    <Board titulo="Etapas" subtitulo={`${grupos.length} etapas · ${atendimentos.length} atendimentos`} filtros={filtros}>
      {grupos.map(([tipo, lista]) => {
        const ids = new Set(lista.map((e) => e.id));
        const atends = atendimentos.filter((a) => ids.has(a.etapa?.id));
        return (
          <BoardColumn key={tipo} nome={lista[0].nome} cor={CORES[tipo] ?? CORES[0]} quantidade={atends.length} vazio="Sem atendimentos">
            {atends.map((a) => (
              <BoardCard key={a.id} titulo={`Atendimento #${a.id}`} subtitulo={a.funil?.nome}>
                <small>
                  {a.atendente?.setor} · {a.atendente?.nomeCompleto} · {new Date(a.dataCriacao).toLocaleDateString("pt-BR")}
                </small>
              </BoardCard>
            ))}
          </BoardColumn>
        );
      })}
    </Board>
  );
};

export default Etapas;
