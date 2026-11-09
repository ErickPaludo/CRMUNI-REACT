import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import "./Aviso.css";

// tipo: "alerta" (laranja) | "info" (azul)
const Aviso = ({ tipo = "alerta", titulo, children }) => {
  const Icone = tipo === "info" ? InfoOutlined : WarningAmberOutlined;
  return (
    <div className={`aviso aviso-${tipo}`} role="alert">
      <Icone />
      <div>
        {titulo && <strong>{titulo}</strong>}
        <p>{children}</p>
      </div>
    </div>
  );
};

export default Aviso;
