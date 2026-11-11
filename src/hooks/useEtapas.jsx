import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";

const EtapasContext = createContext(null);

// Carrega GET /etapa logo que a sessão autentica e guarda para o resto do app. Fica dentro do <AuthProvider>.
export function EtapasProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const api = useApi();
  const [etapas, setEtapas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [versao, setVersao] = useState(0); // incrementar = buscar de novo

  useEffect(() => {
    if (!isAuthenticated) {
      setEtapas([]);
      return;
    }
    let ativo = true;
    setCarregando(true);
    api
      .get("/etapa")
      .then((r) => ativo && setEtapas(r.etapas ?? []))
      .catch(() => ativo && setEtapas([]))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [isAuthenticated, api, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);
  const value = useMemo(() => ({ etapas, carregando, recarregar }), [etapas, carregando, recarregar]);
  return <EtapasContext.Provider value={value}>{children}</EtapasContext.Provider>;
}

export function useEtapas() {
  const ctx = useContext(EtapasContext);
  if (!ctx) throw new Error("useEtapas deve ser usado dentro de <EtapasProvider>");
  return ctx;
}
