import { web3, BN, utils } from "@coral-xyz/anchor";
import { getProgram } from "../getProgram.ts";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { deriveEscrowPda } from "../escrow.ts";
import { PublicKey, SystemProgram } from "@solana/web3.js";



 export const cancelEscrow = async (  escrowId: number,
  connection: web3.Connection,
  wallet: AnchorWallet) => {

        if (!wallet?.publicKey) {
          return;
        }
    
        try {
    
          const program = await getProgram(connection, wallet);

            const [escrowPda] = deriveEscrowPda(wallet.publicKey, new BN(escrowId));
      const maker = wallet.publicKey;


            const [vaultPda] = web3.PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("vault"),
      maker.toBuffer(),
      new BN(escrowId).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
          
          // const [escrowPda] = web3.PublicKey.findProgramAddressSync(
          //   [Buffer.from("escrow"), wallet.publicKey.toBuffer(), new BN(escrowId).toArrayLike(Buffer, "le", 8)],
          //   program.programId
          // );
    
          const ix = await program.methods
        .cancelBeforeStart()
        .accounts({
          maker: maker,
          escrow: escrowPda,
          vault: vaultPda,
          systemProgram: SystemProgram.programId,
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
