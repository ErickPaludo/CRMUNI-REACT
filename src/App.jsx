import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import RegistraEmpresa from "./pages/registrar/empresa/RegistraEmpresa"
import Empresa from "./pages/empresa/Empresa"
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import SearchForm from "./pages/SearchForm";

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <SearchForm />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<RegistraEmpresa />} />
          <Route path="/empresa" element={<Empresa />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
