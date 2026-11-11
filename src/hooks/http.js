import { rastrear } from "./carregamento";

export const API_URL = import.meta.env.VITE_API_URL ?? "https://crmuniapi.pldprojects.com.br/crmuni";
//export const API_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7028/crmuni";

// Padrão de erro da API: { title, status, instance }
export class ApiError extends Error {
  constructor(status, title, instance) {
    super(title);
    this.status = status;
    this.instance = instance;
  }
}

export async function parseError(res) {
  const body = await res.json().catch(() => ({}));
  // 400 de validação do ASP.NET traz `errors: { Campo: ["msg"] }`; statusText é vazio em HTTP/2
  const detalhes = Object.values(body.errors ?? {}).flat().join(" ");
  const msg = detalhes || body.title || res.statusText || `Erro ${res.status}`;
  return new ApiError(body.status ?? res.status, msg, body.instance);
}

export const postJson = (path, body) =>
  rastrear(
    (async () => {
      const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        credentials: "include", // cookie HttpOnly do refresh token
        headers: { "Content-Type": "application/json" },
        body: body && JSON.stringify(body),
      });
      if (!res.ok) throw await parseError(res);
      return res.status === 204 ? null : res.json();
    })(),
  );
