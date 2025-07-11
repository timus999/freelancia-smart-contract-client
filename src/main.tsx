import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import  { WalletContextProvider }  from "./context/WalletProvider.tsx";

const container = document.getElementById("root") as HTMLElement;

createRoot(container).render(
  <StrictMode>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
  </StrictMode>
);