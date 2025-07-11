// import React, { useState } from 'react';
// import { useAnchorWallet } from '@solana/wallet-adapter-react';
// import { Connection } from '@solana/web3.js';
// import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';  // ✅ New Anchor uses `AnchorProvider`
// import idl from '../idl/escrow.json';

// const EscrowCreate = () => {
//   const wallet = useAnchorWallet();

//   function getProvider() {
//     if (!wallet) return null;

//     const network = "http://127.0.0.1:8899";
//     const connection = new Connection(network, "processed");

//     const provider = new AnchorProvider(
//       connection,
//       wallet,
//       { preflightCommitment: "processed" }
//     );

//     return provider;
//   }

//   const provider = getProvider(); // Optional: call it here for testing
//   console.log("Provider", provider);

//   async function createEscrow() {
//     const provider = getProvider();

//     const baseAccount = web3.Keypair.generate();

//     if (!provider) {
//       throw("Provider is null");

//     }

//     const a = JSON.stringify(idl);
//     const b = JSON.parse(a);

//     const program = new Program(b, idl.address, provider);
//     try{

//         await program.methods
//       .createEscrow(/* args here if needed */)
//       .accounts({
//         escrow: baseAccount.publicKey,
//         user: provider.wallet.publicKey,
//         systemProgram: web3.SystemProgram.programId,
//       })
//       .signers([baseAccount])
//       .rpc();
//       const account = await program.account.escrow.fetch(baseAccount.publicKey);
//       console.log("Account data:", account);
//     } catch (err) {
//       console.log("Transaction Error: ", err);
//     }
//   }

//   return (
//     <>
//       <div className='flex items-center justify-center'>
//       <button className='bg-amber-400 p-2' onClick={createEscrow}>Create escrow</button>

//       </div>
//     </>
//   );
// };

// export default EscrowCreate;

import {
  useWallet,
  useConnection,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { createEscrow } from "../utils/escrow.ts";

export default function EscrowCreate() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const onClick = async () => {
    if (!wallet) return alert("Connect wallet first");

    const pda = await createEscrow(
      {
        connection,
        wallet,
        escrowId: 12,
        amountSol: 1.2,
        takerPk: "", // empty → placeholder
        deadline: Date.now() / 1e3 + 86400, // +24 h
        autoReleaseAt: Date.now() / 1e3 + 172800, // +48 h
        spec: "Initial offer — TBD",
        arbiterPk: null,
      } // taker for demo
    );

    alert(`Escrow created at ${pda.toBase58()}`);
  };

  return (
    <button onClick={onClick} className="bg-amber-400 p-2 rounded-lg">
      Create Escrow
    </button>
  );
}
