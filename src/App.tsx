import WalletConnector from "./components/WalletConnector.tsx";
import Balance from "./components/Balance.tsx";
import EscrowCreate from "./components/EscrowCreate.tsx";
import EscrowViewer from "./components/EscrowViewer.tsx";
import EscrowApprover from "./components/EscrowApprove.tsx";



function App() {
  return (
    <main className="min-h-screen m-auto">
      <WalletConnector />
      <Balance />
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Escrow Manager</h1>
      
        <div className="mb-8">
          <EscrowCreate />
        </div>
      
        <div>
          <EscrowViewer />
        </div>

        <div>
          <EscrowApprover />
        </div>
    </div>

    </main>
  );
}


export default App;
