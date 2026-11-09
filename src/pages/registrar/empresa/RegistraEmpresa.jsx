import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CampoTexto from "../../../components/CampoTexto";
import { postJson } from "../../../hooks/http";
import { mascaraCnpj } from "../../../utils/formatadores";
import "./RegistraEmpresa.css";

const etapas = {
  empresa: {
    titulo: "Dados da empresa",
    campos: [
      ["nome", "Nome"],
      ["cnpj", "CNPJ"],
      ["email", "E-mail", "email"],
      ["telefone", "Telefone", "tel"],
    ],
  },
  usuario: {
    titulo: "Dados do usuário",
    campos: [
      ["primeiroNome", "Primeiro nome"],
      ["segundoNome", "Segundo nome"],
      ["email", "E-mail", "email"],
      ["senha", "Senha", "password"],
      ["confirmacaoSenha", "Confirmação de senha", "password"],
    ],
  },
};

const grupos = Object.keys(etapas);

const vazio = Object.fromEntries(
  grupos.map((g) => [
    g,
    Object.fromEntries(etapas[g].campos.map(([nome]) => [nome, ""])),
  ]),
);

const RegistraEmpresa = () => {
  const [form, setForm] = useState(vazio);
  const [etapa, setEtapa] = useState(0);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const grupo = grupos[etapa];
  const ultima = etapa === grupos.length - 1;
  const senhasDiferem =
    form.usuario.confirmacaoSenha !== "" &&
    form.usuario.senha !== form.usuario.confirmacaoSenha;

  const alterar = (nome) => (e) => {
    let valor = e.target.value;
    if (nome === "cnpj") valor = mascaraCnpj(valor);
    if (nome === "telefone") valor = valor.replace(/\D/g, "").slice(0, 12); // ex.: 554796101260
    setForm((f) => ({ ...f, [grupo]: { ...f[grupo], [nome]: valor } }));
  };

  const enviar = async (e) => {
    e.preventDefault(); // o `required` nativo já validou a etapa atual
    if (!ultima) return setEtapa(etapa + 1);
    if (senhasDiferem) return;
    setErro("");
    setEnviando(true);
    try {
      // endpoint público: sem token. Base já inclui /crmuni
      await postJson("/Empresa/Cadastro", form); // `form` já tem o formato { empresa, usuario }
      navigate("/login");
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="registro-pagina">
      <form className="registro-form" onSubmit={enviar}>
        <h1 className="registro-titulo">Bem-vindo</h1>
        <p className="registro-subtitulo">Vamos criar sua conta!</p>
        <div className="registro-etapa">
          Etapa {etapa + 1} de {grupos.length} — {etapas[grupo].titulo}
        </div>

        {etapas[grupo].campos.map(([nome, label, type]) => {
          const confirmacao = nome === "confirmacaoSenha";
          return (
            <CampoTexto
              key={nome}
              label={label}
              type={type}
              value={form[grupo][nome]}
              onChange={alterar(nome)}
              required
              error={confirmacao && senhasDiferem}
              helperText={
                confirmacao && senhasDiferem ? "As senhas não coincidem" : ""
              }
            />
          );
        })}

        {etapa > 0 && (
          <Button className="registro-voltar" onClick={() => setEtapa(etapa - 1)}>
            Voltar
          </Button>
        )}
        {erro && (
          <p className="registro-erro" role="alert">
            {erro}
          </p>
        )}
        <Button className="registro-botao" type="submit" variant="contained" disabled={enviando}>
          {ultima ? "Criar conta" : "Próximo"}
        </Button>

        <Button className="registro-voltar" sx={{ mt: 1.5 }} onClick={() => navigate("/login")}>
          Voltar para o login
        </Button>

        <p className="registro-rodape">
          Ao criar a conta, você concorda com os Termos de Uso e a Política de
          Privacidade do CRMUNI.
        </p>
      </form>
    </div>
  );
};

export default RegistraEmpresa;
