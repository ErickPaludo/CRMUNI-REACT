import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";

const SetoresContext = createContext(null);

// Carrega GET /setor logo que a sessão autentica e guarda para o resto do app. Fica dentro do <AuthProvider>.
export function SetoresProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const api = useApi();
  const [setores, setSetores] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSetores([]);
      return;
    }
    let ativo = true;
    api
      .get("/setor")
      .then((r) => ativo && setSetores(r.setores ?? []))
      .catch(() => ativo && setSetores([]));
    return () => {
      ativo = false;
    };
  }, [isAuthenticated, api]);

  const value = useMemo(() => ({ setores }), [setores]);
  return <SetoresContext.Provider value={value}>{children}</SetoresContext.Provider>;
}

export function useSetores() {
  const ctx = useContext(SetoresContext);
  if (!ctx) throw new Error("useSetores deve ser usado dentro de <SetoresProvider>");
  return ctx;
}
