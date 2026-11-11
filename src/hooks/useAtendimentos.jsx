import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";

const AtendimentosContext = createContext(null);

// Carrega GET /atendimento logo que a sessão autentica e guarda para o resto do app. Fica dentro do <AuthProvider>.
export function AtendimentosProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const api = useApi();
  const [atendimentos, setAtendimentos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [versao, setVersao] = useState(0); // incrementar = buscar de novo (ex.: após alterar a etapa)

  useEffect(() => {
    if (!isAuthenticated) {
      setAtendimentos([]);
      return;
    }
    let ativo = true;
    setCarregando(true);
    api
      .get("/atendimento")
      .then((r) => ativo && setAtendimentos(r.atendimentos ?? []))
      .catch(() => ativo && setAtendimentos([]))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [isAuthenticated, api, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);
  const value = useMemo(() => ({ atendimentos, carregando, recarregar }), [atendimentos, carregando, recarregar]);
  return <AtendimentosContext.Provider value={value}>{children}</AtendimentosContext.Provider>;
}

export function useAtendimentos() {
  const ctx = useContext(AtendimentosContext);
  if (!ctx) throw new Error("useAtendimentos deve ser usado dentro de <AtendimentosProvider>");
  return ctx;
}
