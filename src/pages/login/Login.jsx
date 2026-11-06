import React from "react";
import TextField from "@mui/material/TextField";
import "./Login.css";
const Login = () => {
  
  return (
    <div className="login">
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
  );
};

export default Login;
