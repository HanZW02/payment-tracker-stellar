import { useState, useEffect } from "react";
import {
  StellarWalletsKit,
  SwkAppDarkTheme,
} from "@creit-tech/stellar-wallets-kit";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";
import { rpc } from "@stellar/stellar-sdk";
import WalletManager from "./components/WalletManager";
import CashierForm from "./components/CashierForm";

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
          filters: [{ type: "contract", contractIds: [CONTRACT_ID] }],
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans text-zinc-50 bg-zinc-950">
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight">
        Payment Tracker
      </h1>
      <p className="mb-8 font-medium text-zinc-400">
        Web3 Cashier System on Stellar Testnet
      </p>

      <WalletManager pubKey={pubKey} setPubKey={setPubKey} />
      
      {pubKey && <CashierForm pubKey={pubKey} />}
    </div>
  );
}

export default App;