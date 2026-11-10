import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";

const UsuarioContext = createContext(null);

// Guarda os dados do funcionário logado. Fica dentro do <AuthProvider>.
export function UsuarioProvider({ children }) {
  const { isAuthenticated, funcionario } = useAuth();
  const api = useApi();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // flag `funcionario` da resposta de login/refresh: false = GET /usuario, true = GET /funcionario
    if (!isAuthenticated || funcionario === null) {
      setUsuario(null);
      return;
    }
    let ativo = true;
    api
      .get(funcionario ? "/funcionario" : "/usuario")
      .then((f) => ativo && setUsuario(f))
      .catch(() => ativo && setUsuario(null));
    return () => {
      ativo = false;
    };
  }, [isAuthenticated, funcionario, api]);

  const value = useMemo(
    () => ({
      usuario,
      nome: usuario ? `${usuario.primeiroNome ?? ""} ${usuario.segundoNome ?? ""}`.trim() : "",
    }),
    [usuario],
  );
  return <UsuarioContext.Provider value={value}>{children}</UsuarioContext.Provider>;
}

export function useUsuario() {
  const ctx = useContext(UsuarioContext);
  if (!ctx) throw new Error("useUsuario deve ser usado dentro de <UsuarioProvider>");
  return ctx;
}
