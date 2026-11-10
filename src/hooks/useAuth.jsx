import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { postJson } from "./http";

const AuthContext = createContext(null);

const ANTECEDENCIA_MS = 30_000;
const MAX_TIMEOUT_MS = 2 ** 31 - 1; // acima disso o setTimeout dispara na hora

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null); // só em memória, nunca em localStorage
  const [funcionario, setFuncionario] = useState(null); // flag `funcionario` da última resposta de login/refresh
  const [carregando, setCarregando] = useState(true); // true até o primeiro refresh terminar
  const tokenRef = useRef(null); // leitura síncrona dentro dos hooks de API
  const inflight = useRef(null); // single-flight: chamadas paralelas compartilham o mesmo refresh
  const timer = useRef(null);
  const refreshRef = useRef(null);

  const setToken = useCallback((t) => {
    tokenRef.current = t;
    setTokenState(t);
  }, []);

  // shortcut: só limpa o token em memória; o cookie HttpOnly só a API apaga, adicionar chamada quando houver endpoint
  const logout = useCallback(() => {
    clearTimeout(timer.current);
    setToken(null);
    setFuncionario(null);
  }, [setToken]);

  // guarda o token e agenda a renovação ~30s antes de expirar (expirationTokenFormatado, ISO)
  const aplicar = useCallback(
    ({ token: novo, expirationTokenFormatado, funcionario: ehFuncionario }) => {
      setToken(novo);
      setFuncionario(ehFuncionario ?? null);
      clearTimeout(timer.current);
      const ms = Date.parse(expirationTokenFormatado) - Date.now() - ANTECEDENCIA_MS;
      if (ms > 0) {
        timer.current = setTimeout(() => refreshRef.current().catch(() => {}), Math.min(ms, MAX_TIMEOUT_MS));
      }
    },
    [setToken],
  );

  const refresh = useCallback(() => {
    inflight.current ??= postJson("/autenticacao/refresh")
      .then((r) => {
        aplicar(r);
        return r.token;
      })
      .catch((e) => {
        logout();
        throw e;
      })
      .finally(() => {
        inflight.current = null;
      });
    return inflight.current;
  }, [aplicar, logout]);
  refreshRef.current = refresh;

  // só o servidor consegue apagar o cookie HttpOnly: pede a ele e, de qualquer forma, limpa a sessão local
  const sair = useCallback(async () => {
    try {
      await postJson("/autenticacao/logout");
    } catch {
      // sem rede ou endpoint indisponível: ainda assim encerra a sessão local
    } finally {
      logout();
    }
  }, [logout]);

  const login = useCallback(async (credenciais) => aplicar(await postJson("/autenticacao", credenciais)), [aplicar]);

  // a cada acesso à página tenta restaurar a sessão pelo cookie refreshToken
  useEffect(() => {
    refresh()
      .catch(() => {})
      .finally(() => setCarregando(false));
    return () => clearTimeout(timer.current);
  }, [refresh]);

  const value = useMemo(
    () => ({ token, tokenRef, isAuthenticated: !!token, funcionario, carregando, login, logout, sair, refresh }),
    [token, funcionario, carregando, login, logout, sair, refresh],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
