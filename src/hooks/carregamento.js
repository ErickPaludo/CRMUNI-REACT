import { useSyncExternalStore } from "react";

// Contador global de requisições em andamento: qualquer chamada à API que passe por `rastrear` liga o carregamento.
let pendentes = 0;
const ouvintes = new Set();
const notificar = () => ouvintes.forEach((l) => l());

export function rastrear(promessa) {
  pendentes++;
  notificar();
  return promessa.finally(() => {
    pendentes--;
    notificar();
  });
}

export const useCarregando = () =>
  useSyncExternalStore(
    (l) => {
      ouvintes.add(l);
      return () => ouvintes.delete(l);
    },
    () => pendentes > 0,
  );
