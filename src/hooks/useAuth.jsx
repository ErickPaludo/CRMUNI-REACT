import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { postJson } from "./http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null); // só em memória, nunca em localStorage
  const tokenRef = useRef(null); // leitura síncrona dentro dos hooks de API

  const setToken = useCallback((t) => {
    tokenRef.current = t;
    setTokenState(t);
  }, []);

  const login = useCallback(
    async (credenciais) => {
      const { accessToken } = await postJson("/autenticacao", credenciais);
      setToken(accessToken);
    },
    [setToken],
  );

  // shortcut: só limpa o token em memória; o cookie HttpOnly só a API apaga, adicionar chamada quando houver endpoint
  const logout = useCallback(() => setToken(null), [setToken]);

  const value = useMemo(
    () => ({ token, tokenRef, isAuthenticated: !!token, login, logout, setToken }),
    [token, login, logout, setToken],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
