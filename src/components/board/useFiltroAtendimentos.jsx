import { useState } from "react";

// situacao (EAtendimentoSituacao): 2 = Finalizado; o resto (Aguardando/EmAndamento) conta como em andamento
const STATUS = [
  { valor: "andamento", rotulo: "Em andamento", ok: (a) => a.situacao !== 2 },
  { valor: "finalizado", rotulo: "Finalizado", ok: (a) => a.situacao === 2 },
  { valor: "todos", rotulo: "Todos", ok: () => true },
];

// Filtros de funcionário (padrão: todos) e status (padrão: em andamento) das telas de quadro.
export function useFiltroAtendimentos(atendimentos) {
  const [funcionario, setFuncionario] = useState("");
  const [status, setStatus] = useState("andamento");

  // Funcionários tirados dos próprios atendimentos: só aparece quem tem algum.
  const funcionarios = [...new Map(atendimentos.filter((a) => a.atendente).map((a) => [a.atendente.id, a.atendente.nomeCompleto]))]
    .sort((x, y) => x[1].localeCompare(y[1]));

  const okStatus = STATUS.find((s) => s.valor === status).ok;
  const filtrados = atendimentos.filter((a) => (!funcionario || String(a.atendente?.id) === funcionario) && okStatus(a));

  const filtros = (
    <>
      <select aria-label="Funcionário" value={funcionario} onChange={(e) => setFuncionario(e.target.value)}>
        <option value="">Todos os funcionários</option>
        {funcionarios.map(([id, nome]) => (
          <option key={id} value={id}>{nome}</option>
        ))}
      </select>
      <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUS.map((s) => (
          <option key={s.valor} value={s.valor}>{s.rotulo}</option>
        ))}
      </select>
    </>
  );

  return { filtrados, filtros };
}
