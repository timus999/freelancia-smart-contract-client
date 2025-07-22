// import WalletConnector from "./components/WalletConnector.tsx";
import AppRoutes from "./components/routes/AppRoutes.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx"



function App() {
  return (
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <AppRoutes />
    </ThemeProvider>
  );
}


export default App;
