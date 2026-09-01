import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit";

interface WalletManagerProps {
  pubKey: string | null;
  setPubKey: (key: string | null) => void;
}

export default function WalletManager({ pubKey, setPubKey }: WalletManagerProps) {
  const handleConnect = async () => {
    try {
      await StellarWalletsKit.authModal();
      const { address } = await StellarWalletsKit.getAddress();
      setPubKey(address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = () => {
    setPubKey(null);
  };

  if (!pubKey) {
    return (
      <button
        onClick={handleConnect}
        className="px-6 py-3 font-semibold transition-colors bg-white rounded-lg text-zinc-950 hover:bg-zinc-200"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-xl border-zinc-800 bg-zinc-900/50">
      <p className="text-sm text-zinc-400">Connected Address</p>
      <code className="px-3 py-1 font-mono text-sm rounded bg-zinc-800 text-zinc-300">
        {pubKey.substring(0, 6)}...{pubKey.substring(pubKey.length - 4)}
      </code>
      <button
        onClick={handleDisconnect}
        className="px-4 py-2 mt-2 text-sm font-semibold transition-colors border rounded-lg border-zinc-700 text-zinc-300 hover:bg-zinc-800"
      >
        Disconnect
      </button>
    </div>
  );
}