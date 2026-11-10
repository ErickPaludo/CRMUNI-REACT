import { useCallback, useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlined from "@mui/icons-material/EditOutlined";
import ManageAccountsOutlined from "@mui/icons-material/ManageAccountsOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DataTable from "../../components/DataTable";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import { useUsuario } from "../../hooks/useUsuario";
import { useSetores } from "../../hooks/useSetores";
import "./Funcionarios.css";

const CAPACIDADE = 10;

// GET /funcionario/geral devolve { funcionarios: [{ funcionario: { id, nomeCompleto, email, setor }, atendimentos }] }.
// shortcut: `atendimentos` aceito como número ou lista, dentro do item ou de `funcionario`; confirmar o formato real da API.
const doApi = ({ funcionario: f, ...item }) => {
  const a = item.atendimentos ?? f.atendimentos;
  return {
    ...mapear(f),
    atendimentos: Array.isArray(a) ? a.length : a ?? undefined,
  };
};

const mapear = (f) => ({
  id: f.id,
  nome: f.nomeCompleto,
  primeiroNome: f.primeiroNome,
  segundoNome: f.segundoNome,
  email: f.email,
  setor: f.setor?.nome ?? "—",
  setorId: f.setor?.id,
});

// input de senha no mesmo padrão dos demais campos do formulário, com botão de mostrar/ocultar
const CampoSenha = ({ label, children, ...props }) => {
  const [ver, setVer] = useState(false);
  return (
    <label>
      {label}
      <span className="func-senha">
        <input type={ver ? "text" : "password"} autoComplete="new-password" {...props} />
        <button type="button" aria-label={ver ? "Ocultar senha" : "Mostrar senha"} onClick={() => setVer(!ver)}>
          {ver ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </button>
      </span>
      {children}
    </label>
  );
};

const VAZIO = { nome: "", email: "", setor: "", senha: "", confirmacao: "" };

const Funcionarios = () => {
  const api = useApi();
  const { setores } = useSetores();
  const { funcionario } = useAuth(); // só quem não é funcionário (false) cadastra funcionários
  const { usuario } = useUsuario();
  // funcionário (true) só edita o próprio cadastro; quem não é funcionário edita todos
  const podeEditar = (f) => funcionario === false || (funcionario === true && f.id === usuario?.id);
  const [lista, setLista] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(null); // funcionário em edição (null = cadastro novo)
  const [erroForm, setErroForm] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState(VAZIO);
  const [busca, setBusca] = useState("");
  const [setorFiltro, setSetorFiltro] = useState(""); // id do setor; vazio = todos

  const buscar = useCallback(async () => {
    setCarregando(true);
    try {
      const r = await api.get("/funcionario/geral");
      setErro("");
      setLista((r.funcionarios ?? []).map(doApi));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [api]);

  // primeira carga ao abrir a tela; depois só pelo botão "Atualizar lista"
  useEffect(() => {
    buscar();
  }, [buscar]);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    // o setor é filtrado aqui mesmo: a lista já traz o id do setor, sem nova chamada à API
    const resultado = lista.filter(
      (f) =>
        (!setorFiltro || f.setorId === setorFiltro) &&
        (f.nome.toLowerCase().includes(q) || f.email.toLowerCase().includes(q)),
    );
    // o funcionário logado fica sempre no topo (o id do /usuario não é o de funcionário, então só vale para `true`)
    const meuId = funcionario === true ? usuario?.id : undefined;
    return meuId === undefined ? resultado : [...resultado].sort((a, b) => (b.id === meuId) - (a.id === meuId));
  }, [lista, busca, setorFiltro, funcionario, usuario]);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const divergente = form.confirmacao !== "" && form.senha !== form.confirmacao;

  const abrirNovo = () => {
    setEditando(null);
    setForm(VAZIO);
    setErroForm("");
    setAberto(true);
  };

  const abrirEdicao = (f) => {
    setEditando(f);
    setForm({ nome: f.nome, email: f.email, setor: f.setorId ?? "", senha: "", confirmacao: "" }); // form.setor guarda o id do setor
    setErroForm("");
    setAberto(true);
  };

  // PATCH /funcionario/{id}: só vai o que mudou; o resto segue null (a API mantém o valor atual)
  const atualizar = async () => {
    const nome = form.nome.trim();
    const mudouNome = nome !== editando.nome;
    const [primeiro, ...resto] = nome.split(/\s+/);
    const idSetor = form.setor;
    const dto = {
      idSetor: idSetor && idSetor !== editando.setorId ? idSetor : null,
      primeiroNome: mudouNome ? primeiro : null,
      segundoNome: mudouNome ? resto.join(" ") : null,
      email: form.email !== editando.email ? form.email : null,
      senha: form.senha ? { senha: form.senha, confirmacaoSenha: form.confirmacao } : null,
    };
    if (Object.values(dto).every((v) => v === null)) {
      setAberto(false); // nada mudou, nada a enviar
      return;
    }
    setSalvando(true);
    setErroForm("");
    try {
      await api.patch(`/funcionario/${editando.id}`, dto);
      setAberto(false);
      await buscar();
    } catch (e) {
      setErroForm(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const salvar = (e) => {
    e.preventDefault();
    if (form.senha !== form.confirmacao) return;
    if (form.senha && form.senha.length < 6) {
      setErroForm("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (editando) return atualizar();
    return cadastrar();
  };

  // POST /funcionario
  const cadastrar = async () => {
    const [primeiro, ...resto] = form.nome.trim().split(/\s+/);
    setSalvando(true);
    setErroForm("");
    try {
      await api.post("/funcionario", {
        idSetor: form.setor,
        primeiroNome: primeiro,
        segundoNome: resto.join(" "),
        email: form.email,
        senha: form.senha,
        confirmacaoSenha: form.confirmacao,
      });
      setForm(VAZIO);
      setAberto(false);
      await buscar();
    } catch (e) {
      setErroForm(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const colunas = [
    {
      chave: "nome",
      titulo: "Funcionário",
      render: (f) => (
        <span className="func-nome">
          <strong>{f.nome}</strong>
          <small>{f.email}</small>
        </span>
      ),
    },
    { chave: "setor", titulo: "Setor" },
    {
      chave: "atendimentos",
      titulo: "Atendimentos",
      render: (f) => (
        <span className={`func-mono ${f.atendimentos >= CAPACIDADE ? "cheio" : ""}`}>
          {f.atendimentos === undefined ? "—" : `${f.atendimentos}/${CAPACIDADE}`}
        </span>
      ),
    },
    { chave: "permissao", titulo: "Permissão", render: () => "Atendente" },
    {
      chave: "acoes",
      titulo: "",
      render: (f) =>
        podeEditar(f) && (
          <button className="func-icon" aria-label={`Editar ${f.nome}`} onClick={() => abrirEdicao(f)}>
            <EditOutlined fontSize="small" />
          </button>
        ),
    },
  ];

  let vazio = "Nenhum funcionário encontrado.";
  if (erro) vazio = <span className="func-erro">{erro}</span>;
  else if (carregando && !lista.length) vazio = <CircularProgress size={28} aria-label="Carregando funcionários" />;

  return (
    <div className="func">
      <header className="func-head">
        <div>
          <h1>Funcionários</h1>
          <p>
            {lista.length} colaboradores cadastrados · capacidade máxima de {CAPACIDADE} atendimentos por atendente.
          </p>
        </div>
        {funcionario === false && (
          <button className="func-btn" onClick={abrirNovo}>
            <AddIcon fontSize="small" /> Adicionar
          </button>
        )}
      </header>

      {aberto && (
        <form className="func-card func-form" onSubmit={salvar}>
          <div className="func-form-title">
            <ManageAccountsOutlined fontSize="small" color="primary" />
            <strong>{editando ? "Editar funcionário" : "Novo funcionário"}</strong>
            <button type="button" className="func-icon" aria-label="Fechar" onClick={() => setAberto(false)}>
              <CloseIcon fontSize="small" />
            </button>
          </div>
          <div className="func-fields">
            <label>
              Nome
              <input required value={form.nome} onChange={set("nome")} />
            </label>
            <label>
              E-mail
              <input required type="email" value={form.email} onChange={set("email")} />
            </label>
            {/* funcionário não altera o próprio setor: campo oculto na edição do próprio cadastro */}
            {!(editando && funcionario === true) && (
              <label>
                Setor
                <select required value={form.setor} onChange={set("setor")}>
                  <option value="">Selecione...</option>
                  {setores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <CampoSenha label="Senha" required={!editando} value={form.senha} onChange={set("senha")} />
            <CampoSenha
              label="Confirmar senha"
              required={!editando || !!form.senha}
              value={form.confirmacao}
              onChange={set("confirmacao")}
            >
              {divergente && <small className="func-erro">As senhas não conferem.</small>}
            </CampoSenha>
          </div>
          {erroForm && <small className="func-erro">{erroForm}</small>}
          <button className="func-btn func-save" type="submit" disabled={salvando}>
            {editando ? "Salvar alterações" : "Salvar funcionário"}
          </button>
        </form>
      )}

      <div className="func-filtros">
        <div className="func-search">
          <SearchIcon fontSize="small" />
          <input placeholder="Buscar funcionário..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <select className="func-filtro-setor" aria-label="Filtrar por setor" value={setorFiltro} onChange={(e) => setSetorFiltro(e.target.value)}>
          <option value="">Todos os setores</option>
          {setores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>
      </div>

      <DataTable colunas={colunas} linhas={filtrados} vazio={vazio} />

      <button className="func-btn func-atualizar" onClick={buscar} disabled={carregando}>
        {carregando ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon fontSize="small" />} Atualizar lista
      </button>
    </div>
  );
};

export default Funcionarios;
