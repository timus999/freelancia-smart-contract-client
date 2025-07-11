import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const WalletConnector = () => {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Popup‑style connect button */}
      <WalletMultiButton />

      {/* Show address after connection */}
      {connected && (
        <p className="text-sm break-all">Connected: {publicKey?.toString()}</p>
      )}
    </div>
  );
};

export default WalletConnector;
