import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";

const FunisContext = createContext(null);

// Carrega GET /funil logo que a sessão autentica e guarda para o resto do app. Fica dentro do <AuthProvider>.
export function FunisProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const api = useApi();
  const [funis, setFunis] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setFunis([]);
      return;
    }
    let ativo = true;
    setCarregando(true);
    api
      .get("/funil")
      // shortcut: formato do retorno não documentado no Swagger; aceita { funis: [...] } ou lista direta
      .then((r) => ativo && setFunis(Array.isArray(r) ? r : (r.funis ?? [])))
      .catch(() => ativo && setFunis([]))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [isAuthenticated, api]);

  const value = useMemo(() => ({ funis, carregando }), [funis, carregando]);
  return <FunisContext.Provider value={value}>{children}</FunisContext.Provider>;
}

export function useFunis() {
  const ctx = useContext(FunisContext);
  if (!ctx) throw new Error("useFunis deve ser usado dentro de <FunisProvider>");
  return ctx;
}
