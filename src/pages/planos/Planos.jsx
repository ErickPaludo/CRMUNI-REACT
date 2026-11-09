import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlined from "@mui/icons-material/EditOutlined";
import "../funcionarios/Funcionarios.css";
import "./Planos.css";

// shortcut: dados fixos em memória, trocar por useApi (GET/POST/PATCH planos da empresa) quando a API existir.
const INICIAL = [
  { id: 1, nome: "Básico", preco: 99.9, descricao: "Até 3 atendentes", ativo: true },
  { id: 2, nome: "Premium", preco: 249.9, descricao: "Atendentes ilimitados e relatórios", ativo: false },
];

const VAZIO = { id: null, nome: "", preco: "", descricao: "", ativo: true };
// recebe só dígitos (centavos) e devolve "1.234,56"; vazio continua vazio para mostrar o placeholder
const mascara = (d) => (d ? (Number(d) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "");
const moeda =(v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Planos = () => {
  const [lista, setLista] = useState(INICIAL);
  const [form, setForm] = useState(null); // null = fechado

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const salvar = (e) => {
    e.preventDefault();
    const plano = { ...form, preco: Number(form.preco.replace(/\./g, "").replace(",", ".")) };
    setLista(form.id ? lista.map((p) => (p.id === form.id ? plano : p)) : [...lista, { ...plano, id: Date.now() }]);
    setForm(null);
  };

  return (
    <div className="func">
      <header className="func-head">
        <h1>Planos</h1>
        <button className="func-btn" onClick={() => setForm(VAZIO)}>
          <AddIcon fontSize="small" /> Adicionar
        </button>
      </header>

      {form && (
        <form className="func-card func-form" onSubmit={salvar}>
          <div className="func-form-title">
            <strong>{form.id ? "Editar plano" : "Novo plano"}</strong>
            <button type="button" className="func-icon" aria-label="Fechar" onClick={() => setForm(null)}>
              <CloseIcon fontSize="small" />
            </button>
          </div>
          <div className="func-fields">
            <label>
              Nome
              <input required maxLength={25} value={form.nome} onChange={set("nome")} />
            </label>
            <label>
              Preço
              <input
                required
                inputMode="decimal"
                placeholder="R$00,00"
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: mascara(e.target.value.replace(/\D/g, "")) })}
              />
            </label>
          </div>
          <div className="func-fields planos-desc">
            <label>
              Descrição
              <textarea rows={5} maxLength={400}value={form.descricao} onChange={set("descricao")} />
            </label>
          </div>
          <label className="planos-ativo">
            <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />
            Ativo
          </label>
          <button className="func-btn func-save" type="submit">
            Salvar plano
          </button>
        </form>
      )}

      <div className="func-card func-table">
        <div className="func-row planos-row func-th">
          <span>Nome</span>
          <span>Preço</span>
          <span>Descrição</span>
          <span>Ativo</span>
          <span />
        </div>
        {lista.map((p) => (
          <div className="func-row planos-row" key={p.id}>
            <strong>{p.nome}</strong>
            <span>{moeda(p.preco)}</span>
            <span>{p.descricao}</span>
            <span>
              <em className={`func-badge ${p.ativo ? "online" : "offline"}`}>{p.ativo ? "Ativo" : "Inativo"}</em>
            </span>
            <button className="func-icon" aria-label={`Editar ${p.nome}`} onClick={() => setForm({ ...p, preco: mascara(String(Math.round(p.preco * 100))) })}>
              <EditOutlined fontSize="small" />
            </button>
          </div>
        ))}
        {!lista.length && <div className="func-vazio">Nenhum plano cadastrado.</div>}
      </div>
    </div>
  );
};

export default Planos;
