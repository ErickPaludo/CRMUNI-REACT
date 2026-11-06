import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import RegistraEmpresa from "./pages/registrar/empresa/RegistraEmpresa";
import Empresa from "./pages/empresa/Empresa";
import Mensagem from "./pages/mensagem/Mensagem";
import Navbar from "./components/Navbar";
import SidebarLayout from "./components/sidebar/SidebarLayout";
import NotFound from "./pages/NotFound";
import SearchForm from "./pages/SearchForm";

function App() {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <SearchForm />
        <Routes>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/empresa" element={<Empresa />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<RegistraEmpresa />} />
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
