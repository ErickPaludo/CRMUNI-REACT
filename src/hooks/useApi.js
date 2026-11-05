import { useCallback, useMemo } from "react";
import { API_URL, parseError } from "./http";
import { useAuth } from "./useAuth";
import { useRefreshToken } from "./useRefreshToken";

const MARGEM_SEG = 30;

// shortcut: não valida a assinatura (só o backend pode), lê apenas o exp; token ilegível = trata como expirado
function expirando(token) {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return exp - Date.now() / 1000 < MARGEM_SEG;
  } catch {
    return true;
  }
}

export function useApi() {
  const { tokenRef, logout } = useAuth();
  const refresh = useRefreshToken();

  const request = useCallback(
    async (method, path, body) => {
      const send = (token) =>
        fetch(`${API_URL}${path}`, {
          method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        });

      let token = tokenRef.current;
      if (token && expirando(token)) token = await refresh();

      let res = await send(token);
      if (res.status === 401) {
        res = await send(await refresh()); // uma única tentativa
        if (res.status === 401) {
          logout();
          throw await parseError(res);
        }
      }
      if (!res.ok) throw await parseError(res);
      return res.status === 204 ? null : res.json();
    },
    [tokenRef, refresh, logout],
  );

  return useMemo(
    () => ({
      get: (path) => request("GET", path),
      post: (path, body) => request("POST", path, body),
      patch: (path, body) => request("PATCH", path, body),
    }),
    [request],
  );
}
