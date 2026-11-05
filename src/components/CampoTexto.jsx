import { useId, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./CampoTexto.css";

// Campo com label sempre acima; type="password" ganha o botão de mostrar/ocultar.
const CampoTexto = ({ label, type = "text", ...props }) => {
  const id = useId();
  const [ver, setVer] = useState(false);
  const senha = type === "password";

  return (
    <div className="campo">
      <label htmlFor={id} className="campo-label">
        {label}
      </label>
      <TextField
        id={id}
        fullWidth
        size="small"
        type={senha && ver ? "text" : type}
        slotProps={{
          input: senha
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setVer(!ver)}
                      edge="end"
                    >
                      {ver ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : undefined,
        }}
        {...props}
      />
    </div>
  );
};

export default CampoTexto;
