import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import RegistraEmpresa from "./pages/registrar/empresa/RegistraEmpresa";
import Empresa from "./pages/empresa/Empresa";
import Funcionarios from "./pages/funcionarios/Funcionarios";
import Planos from "./pages/planos/Planos";
import Setores from "./pages/setores/Setores";
import Funil from "./pages/funil/Funil";
import Etapas from "./pages/etapas/Etapas";
import Mensagens from "./pages/mensagens/Mensagens";
import Atendimentos from "./pages/atendimentos/Atendimentos";
import Mensagem from "./pages/mensagem/Mensagem";
import Navbar from "./components/Navbar";
import SidebarLayout from "./components/sidebar/SidebarLayout";
import RotaProtegida from "./components/RotaProtegida";
import Carregando from "./components/Carregando";
import NotFound from "./pages/NotFound";
import SearchForm from "./pages/SearchForm";

function App() {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Carregando />
        <SearchForm />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<RegistraEmpresa />} />
          <Route element={<RotaProtegida />}>
          <Route path="/" element={<SidebarLayout />}>
            <Route index element={<Home />} />
            <Route path="empresa" element={<Empresa />} />
            <Route path="funcionarios" element={<Funcionarios />} />
            <Route path="planos" element={<Planos />} />
            <Route path="setores" element={<Setores />} />
            <Route path="funis" element={<Funil />} />
            <Route path="etapas" element={<Etapas />} />
            <Route path="mensagens/:id?" element={<Mensagens />} />
            <Route path="atendimentos" element={<Atendimentos />} />
          </Route>
          </Route>
          <Route
            path="/:guidEmpresa/mensagem/:telefone"
            element={<Mensagem />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
