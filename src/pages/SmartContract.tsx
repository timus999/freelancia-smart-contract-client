import EscrowCreate from "../components/escrow/EscrowCreate.tsx";
import EscrowViewer from "../components/escrow/EscrowViewer.tsx";
import EscrowApprover from "../components/escrow/EscrowApprove.tsx";
import Balance from "@/components/escrow/Balance.tsx";


function SmartContract() {
  return (
    <>
    <main className="min-h-screen m-auto">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Escrow Manager</h1>
        <Balance />
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
    </>
  );
}


export default SmartContract;
