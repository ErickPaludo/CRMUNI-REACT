import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { UsuarioProvider } from './hooks/useUsuario.jsx'
import { SetoresProvider } from './hooks/useSetores.jsx'
import { FunisProvider } from './hooks/useFunis.jsx'
import { EtapasProvider } from './hooks/useEtapas.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UsuarioProvider>
        <SetoresProvider>
          <FunisProvider>
            <EtapasProvider>
              <App />
            </EtapasProvider>
          </FunisProvider>
        </SetoresProvider>
      </UsuarioProvider>
    </AuthProvider>
  </StrictMode>,
)
