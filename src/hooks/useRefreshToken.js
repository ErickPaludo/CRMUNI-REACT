import { useCallback } from "react";
import { postJson } from "./http";
import { useAuth } from "./useAuth";

let inflight = null; // single-flight: chamadas paralelas compartilham o mesmo refresh

export function useRefreshToken() {
  const { setToken, logout } = useAuth();

  return useCallback(() => {
    inflight ??= postJson("/autenticacao/refresh")
      .then(({ accessToken }) => {
        setToken(accessToken);
        return accessToken;
      })
      .catch((e) => {
        logout();
        throw e;
      })
      .finally(() => {
        inflight = null;
      });
    return inflight;
  }, [setToken, logout]);
}
