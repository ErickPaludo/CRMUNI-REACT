import React from "react";
import TextField from "@mui/material/TextField";
import "./Login.css";
const Login = () => {
  
  return (
    <div className="login">
      <div className="login__left">
      <form className="login__card">
        <h1>Bem-vindo de volta 👋</h1>
        <p>Entre com sua conta para acessar o painel.</p>

        <TextField
          label="E-mail"
          type="email"
          placeholder="voce@empresa.com.br"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
        />

        <div className="login__row">
          <label>
            <input type="checkbox" /> Manter conectado
          </label>
          <a href="#">Esqueci minha senha</a>
        </div>

        <button type="submit">Entrar</button>
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
