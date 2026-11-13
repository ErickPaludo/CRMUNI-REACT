import React from "react";
import "./Empresa.css";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import ImageOutlined from "@mui/icons-material/ImageOutlined";

import { useUsuario } from "../../hooks/useUsuario";
import { formatarTelefone, mascaraCnpj } from "../../utils/formatadores";

export default function Empresa() {
  const empresa = useUsuario().usuario?.empresa ?? {};
  return (
    <div className="empresa-page">
      <h1 className="empresa-title">Empresa</h1>
      <p className="empresa-subtitle">Dados cadastrais de operação.</p>

      <section className="empresa-grid">
        <div className="empresa-card">
          <header className="empresa-card-head">
            <div className="empresa-card-icon">
              <ImageOutlined sx={{ fontSize: 16}} />    
    </div>
    <div>
      <h2>Identidade visual</h2>
      <p>Logo exibido nos canais e comunicações</p>
    </div>
  </header>

  <div className="empresa-identity">
    <div className="empresa-logo">
      <ApartmentOutlined sx={{ fontSize: 40 }} />
  </div>
  <strong className="empresa-name">{empresa.nome}</strong>
  </div>
</div>

<div className="empresa-card">
  <header className="empresa-card-head">
    <div className="empresa-card-icon">
      <ApartmentOutlined sx={{ fontSize: 16 }} />
    </div>
    <div>
      <h2>Dados da empresa</h2>
      <p>Informações utilizadas em cadastros e relatórios</p>
    </div>
    </header>

    <div className="empresa-fields">
      <Campo id="nome" label="Nome da empresa" value={empresa.nome ?? ""} />
      <Campo id="cnpj" label="CNPJ" value={mascaraCnpj(empresa.cnpj ?? "")} />
      <Campo id="telefone" label="Telefone" value={formatarTelefone(empresa.telefone ?? "")} />
      <Campo id="email" label="E-mail" value={empresa.email ?? ""} />
    </div>
  </div>
  </section>
</div>
  );
};

function Campo({ id, label, value }) {
  return (
    <div className="empresa-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} readOnly />
    </div>
  );
}