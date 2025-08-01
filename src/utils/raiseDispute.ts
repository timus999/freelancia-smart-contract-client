import { web3, BN, utils } from "@coral-xyz/anchor";
import { getProgram } from "./getProgram.ts";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { deriveEscrowPda } from "./escrow.ts";
import { hash } from "./escrow.ts";



 export const raiseDispute = async (  escrowId: number,
    maker: string,
  connection: web3.Connection,
  wallet: AnchorWallet) => {

        if (!wallet?.publicKey) {
          return;
        }
    
        try {
    
        const program = await getProgram(connection, wallet);

        const makerPK = new web3.PublicKey(maker);

        const [escrowPda] = deriveEscrowPda(makerPK, new BN(escrowId));

        const evidenceCID = "dummyhash"; 
        const evidenceHashHex = await hash(evidenceCID);

        // console.log(evidenceHashHex);


    //        if (!evidenceHashHex || evidenceHashHex.length !== 64) {
    //   throw new Error("Evidence hash must be a valid 32-byte (64-char hex) string.");
    // }

        // const evidenceBuffer = Buffer.from(evidenceHashHex, "hex");
    //   if (evidenceBuffer.length !== 32) {
    //     throw new Error("Evidence hash must be exactly 32 bytes.");
    //   }
          
          // const [escrowPda] = web3.PublicKey.findProgramAddressSync(
          //   [Buffer.from("escrow"), wallet.publicKey.toBuffer(), new BN(escrowId).toArrayLike(Buffer, "le", 8)],
          //   program.programId
          // );
    
        const ix = await program.methods
        .raiseDispute(Array.from(evidenceHashHex)) // convert Buffer to array of u8
        .accounts({
          caller: wallet.publicKey,
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
