import { PublicKey } from "@solana/web3.js";

// Solana SysvarClock address
const CLOCK_SYSVAR = new PublicKey("SysvarC1ock11111111111111111111111111111111");

/**
 * Fetches the current Solana blockchain time (Unix timestamp)
 */
export async function getSolanaUnixTimestamp(connection: any): Promise<number> {
  const accountInfo = await connection.getAccountInfo(CLOCK_SYSVAR);
  if (!accountInfo?.data) {
    throw new Error("Clock sysvar not found");
  }

  // Read 64-bit little-endian timestamp from byte offset 32
  const unixTimestamp = Number(accountInfo.data.readBigInt64LE(32));
  return unixTimestamp;
}
