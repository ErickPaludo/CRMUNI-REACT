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
      <h2>Tudo o que você precisa em um só lugar</h2>
      <p>
        Gerencie seus projetos, acompanhe resultados e acesse suas informações de forma simples, rápida e segura.
      </p>
      <ul>
        <li>Painel completo e fácil de usar</li>
        <li>Seus dados sempre protegidos</li>
        <li>Acesso de qualquer dispositivo</li>
      </ul>
    </div>
  </div>
  );    
};

export default Login;
