// 5547999991234 -> (47) 99999-1234; fora do padrão devolve o texto cru
export const formatarTelefone = (t = "") => {
  const m = t.match(/^(?:55)?(\d{2})(\d{4,5})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : t;
};

// 00.000.000/0000-00: só dígitos, no máximo 14
export const mascaraCnpj = (v) =>
  v
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
