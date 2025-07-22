import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import  { WalletContextProvider }  from "./context/WalletProvider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";


const container = document.getElementById("root") as HTMLElement;

createRoot(container).render(
  <StrictMode>
    <AuthProvider>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
    </AuthProvider>
  </StrictMode>
);