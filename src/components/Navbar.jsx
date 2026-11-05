import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
const Navbar = () => {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/registrar">Registro</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/empresa">Empresa</NavLink>

    </nav>
  );
};

export default Navbar;
