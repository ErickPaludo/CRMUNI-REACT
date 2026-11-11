import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useFunis } from "../../hooks/useFunis";
import { useAtendimentos } from "../../hooks/useAtendimentos";
import Board from "../../components/board/Board";
import BoardColumn from "../../components/board/BoardColumn";
import BoardCard from "../../components/board/BoardCard";
import { useFiltroAtendimentos } from "../../components/board/useFiltroAtendimentos";

const CORES = ["#6b7280", "#7c3aed", "#2563eb"]; // por `tipo` do funil

const Funil = () => {
  const { funis, carregando: carregandoFunis } = useFunis();
  const { atendimentos: todos, carregando: carregandoAtend, recarregar } = useAtendimentos();
  useEffect(recarregar, [recarregar]); // busca de novo ao entrar na tela
  const { filtrados: atendimentos, filtros } = useFiltroAtendimentos(todos);

  if (carregandoFunis || carregandoAtend) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: 48 }}>
        <CircularProgress aria-label="Carregando funil" />
      </div>
    );
  }

  // uma coluna por funil; cada atendimento é um cartão no funil em que está
  return (
    <Board titulo="Funil de Vendas" subtitulo={`${atendimentos.length} atendimentos`} filtros={filtros}>
      {funis.map((f) => {
        const cards = atendimentos.filter((a) => a.funil?.id === f.id);
        return (
          <BoardColumn key={f.id} nome={f.nome} cor={CORES[f.tipo] ?? CORES[0]} quantidade={cards.length} vazio="Sem atendimentos">
            {cards.map((a) => (
              <BoardCard key={a.id} titulo={`Atendimento #${a.id}`} subtitulo={a.etapa?.nome}>
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

export default Funil;
