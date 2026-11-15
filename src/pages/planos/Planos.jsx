import { useCallback, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import "../funcionarios/Funcionarios.css";
import "./Planos.css";

// GET/POST /plano e PATCH /plano/{id}; situacao: 0 = ativo, 1 = inativo
// GET devolve PlanosDto: { planos: [{ id, idEmpresa, nome, descricao, preco, situacao }] }
const VAZIO = { id: null, nome: "", preco: "", descricao: "", situacao: 0 };
// recebe só dígitos (centavos) e devolve "1.234,56"; vazio continua vazio para mostrar o placeholder
const mascara = (d) => (d ? (Number(d) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "");
const moeda =(v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Planos = () => {
  const api = useApi();
  const admin = useAuth().funcionario === false; // só administrador cria/edita planos
  const [lista, setLista] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState(null); // null = fechado
  const [erroForm, setErroForm] = useState("");
  const [salvando, setSalvando] = useState(false);

  const buscar = useCallback(async () => {
    setCarregando(true);
    try {
      setLista((await api.get("/plano"))?.planos ?? []);
      setErro("");
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [api]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const abrir = (f) => {
    setErroForm("");
    setForm(f);
  };

  const salvar = async (e) => {
    e.preventDefault();
    const dto = { nome: form.nome, descricao: form.descricao, preco: Number(form.preco.replace(/\./g, "").replace(",", ".")) };
    setSalvando(true);
    setErroForm("");
    try {
      if (form.id) await api.patch(`/plano/${form.id}`, { ...dto, situacao: form.situacao });
      else await api.post("/plano", dto);
      setForm(null);
      await buscar();
    } catch (e) {
      setErroForm(e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="func">
      <header className="func-head">
        <h1>Planos</h1>
        {admin && (
          <button className="func-btn" onClick={() => abrir(VAZIO)}>
            <AddIcon fontSize="small" /> Adicionar
          </button>
        )}
      </header>

      {admin && form && (
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
              <textarea rows={5} maxLength={400} value={form.descricao} onChange={set("descricao")} />
              <small>Máximo de 400 caracteres ({form.descricao.length}/400)</small>
            </label>
          </div>
          {form.id && (
            <label className="planos-ativo">
              <input type="checkbox" checked={form.situacao === 0} onChange={(e) => setForm({ ...form, situacao: e.target.checked ? 0 : 1 })} />
              Ativo
            </label>
          )}
          {erroForm && <small className="func-erro">{erroForm}</small>}
          <button className="func-btn func-save" type="submit" disabled={salvando}>
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
            {p.descricao ? (
              <details className="planos-desc-toggle">
                <summary>Ver descrição</summary>
                <p>{p.descricao}</p>
              </details>
            ) : (
              <span>-</span>
            )}
            <span>
              <em className={`func-badge ${p.situacao === 0 ? "online" : "offline"}`}>{p.situacao === 0 ? "Ativo" : "Inativo"}</em>
            </span>
            {admin ? (
              <button className="func-icon" aria-label={`Editar ${p.nome}`} onClick={() => abrir({ ...p, preco: mascara(String(Math.round(p.preco * 100))) })}>
                <EditOutlined fontSize="small" />
              </button>
            ) : (
              <span />
            )}
          </div>
        ))}
        {erro ? (
          <div className="func-vazio func-erro">{erro}</div>
        ) : carregando && !lista.length ? (
          <div className="func-vazio"><CircularProgress size={28} aria-label="Carregando planos" /></div>
        ) : (
          !lista.length && <div className="func-vazio">Nenhum plano cadastrado.</div>
        )}
      </div>
    </div>
  );
};

export default Planos;
