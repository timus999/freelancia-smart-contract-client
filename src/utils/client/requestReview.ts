import { web3, BN } from "@coral-xyz/anchor";
import { getProgram } from "../getProgram.ts";
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { deriveEscrowPda } from "../escrow.ts";



 export const requestReviewEscrow = async (  escrowId: number,
  connection: web3.Connection,
  wallet: AnchorWallet) => {

        if (!wallet?.publicKey) {
          return;
        }
    
        try {
    
          const program = await getProgram(connection, wallet);

            const [escrowPda] = deriveEscrowPda(wallet.publicKey, new BN(escrowId));
          
          // const [escrowPda] = web3.PublicKey.findProgramAddressSync(
          //   [Buffer.from("escrow"), wallet.publicKey.toBuffer(), new BN(escrowId).toArrayLike(Buffer, "le", 8)],
          //   program.programId
          // );
    
          const ix = await program.methods
            .requestRevision()
            .accounts({
              maker: wallet.publicKey,
              escrow: escrowPda,
            })
            .instruction();
    
            const tx = new web3.Transaction().add(ix);
            tx.feePayer = wallet.publicKey;
            tx.recentBlockhash = (
              await connection.getLatestBlockhash("finalized")
            ).blockhash;
            
            const signedTx = await wallet.signTransaction(tx);
            const sig = await connection.sendRawTransaction(signedTx.serialize());
            await connection.confirmTransaction(sig, "confirmed");
    
    
        } catch (err) {
          console.error("Request revision error:", err);
        }
      };
