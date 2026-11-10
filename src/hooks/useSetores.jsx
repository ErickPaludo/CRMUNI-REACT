import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";

const SetoresContext = createContext(null);

// Carrega GET /setor logo que a sessão autentica e guarda para o resto do app. Fica dentro do <AuthProvider>.
export function SetoresProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const api = useApi();
  const [setores, setSetores] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setSetores([]);
      return;
    }
    let ativo = true;
    setCarregando(true);
    api
      .get("/setor")
      .then((r) => ativo && setSetores(r.setores ?? []))
      .catch(() => ativo && setSetores([]))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [isAuthenticated, api]);

  const value = useMemo(() => ({ setores, carregando }), [setores, carregando]);
  return <SetoresContext.Provider value={value}>{children}</SetoresContext.Provider>;
}

export function useSetores() {
  const ctx = useContext(SetoresContext);
  if (!ctx) throw new Error("useSetores deve ser usado dentro de <SetoresProvider>");
  return ctx;
}
