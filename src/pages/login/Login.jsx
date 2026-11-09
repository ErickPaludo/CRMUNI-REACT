import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CampoTexto from "../../components/CampoTexto";
import "./Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [manterConectado, setManterConectado] = useState(false);

  const enviar = (e) => {
    e.preventDefault();

    console.log({
      email,
      senha,
      manterConectado,
    });
  };

  return (
    <div className="login">
      <div className="login__left">
        <form className="login__card" onSubmit={enviar}>
          <h1>Bem-vindo de volta!</h1>
          <p className="login__subtitle">
            Entre com sua conta para acessar o painel.
          </p>

          <CampoTexto
            label="E-mail"
            type="email"
            placeholder="voce@empresa.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <CampoTexto
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <div className="login__row">
            <label className="login__check">
              <input
                type="checkbox"
                checked={manterConectado}
                onChange={(e) => setManterConectado(e.target.checked)}
              />
              Manter conectado
            </label>
            <a href="#">Esqueci minha senha</a>
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              height: "46px",
              borderRadius: "6px",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              backgroundColor: "#2563eb",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "1d4ed8",
                boxShadow: "none",
              },
            }}
          >
            Entrar
          </Button>
          <p className="login__registrar">
            Não tem uma conta? <Link to="/registrar">Registre-se</Link>
          </p>
        </form>
      </div>

      <div className="login__right">
        <h2>Todos os seus atendimentos em um só lugar</h2>
        <p>
          Centralize as conversas entre clientes e funcionários em uma única
          plataforma, com chatbot para a triagem inicial e acompanhamento
          completo das suas vendas.
        </p>
        <ul>
          <li>Triagem automática por setor: Comercial, Financeiro e Suporte</li>
          <li>Histórico e ficha completa de cada cliente</li>
          <li>Dashboards com vendas e tempo de espera</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
