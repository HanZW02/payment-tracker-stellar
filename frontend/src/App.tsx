import { useState, useEffect } from "react";
import {
  StellarWalletsKit,
  SwkAppDarkTheme,
} from "@creit-tech/stellar-wallets-kit";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";
import { rpc } from "@stellar/stellar-sdk";

const server = new rpc.Server("https://soroban-testnet.stellar.org:443");
const CONTRACT_ID = "CAPPSOIGFKBBEEJDKBZ2SEDRZD6IP2R6VZJ5KPWI4Z6PFHS4RWNU65IH";

StellarWalletsKit.init({
  theme: SwkAppDarkTheme,
  modules: defaultModules(),
});

function App() {
  const [pubKey, setPubKey] = useState<string | null>(null);

  useEffect(() => {
    let isFetching = false;

    const pollEvents = async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const latestLedger = await server.getLatestLedger();
        const response = await server.getEvents({
          startLedger: latestLedger.sequence - 10,
          filters: [
            {
              type: "contract",
              contractIds: [CONTRACT_ID],
            },
          ],
        });

        if (response.events && response.events.length > 0) {
          response.events.forEach((event) => {
            console.log("🔥 New Event Captured:", event);
          });
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        isFetching = false;
      }
    };

    const intervalId = setInterval(pollEvents, 4000);
    return () => clearInterval(intervalId);
  }, []);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans text-zinc-50 bg-zinc-950">
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight">
        Payment Tracker
      </h1>
      <p className="mb-8 font-medium text-zinc-400">
        Web3 Cashier System on Stellar Testnet
      </p>

      {!pubKey ? (
        <button
          onClick={handleConnect}
          className="px-6 py-3 font-semibold transition-colors bg-white rounded-lg text-zinc-950 hover:bg-zinc-200"
        >
          Connect Wallet
        </button>
      ) : (
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
      )}
    </div>
  );
}

export default App;