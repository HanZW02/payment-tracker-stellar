import { useState } from "react";

interface CashierFormProps {
  pubKey: string;
}

export default function CashierForm({ pubKey }: CashierFormProps) {
  const [orderId, setOrderId] = useState("");
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Preparing transaction with data:", {
        orderId,
        customer,
        amount,
        admin: pubKey,
      });

      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Dummy transaction success!");
      
      setOrderId("");
      setCustomer("");
      setAmount("");
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 mt-8 border rounded-2xl bg-zinc-900 border-zinc-800">
      <h2 className="mb-6 text-xl font-bold text-white">Create New Payment</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="orderId" className="text-sm font-medium text-zinc-400">
            Order ID
          </label>
          <input
            id="orderId"
            type="text"
            required
            placeholder="e.g., ORD001"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="px-4 py-2 text-white transition-colors border rounded-lg bg-zinc-950 border-zinc-700 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="customer" className="text-sm font-medium text-zinc-400">
            Customer Wallet Address
          </label>
          <input
            id="customer"
            type="text"
            required
            placeholder="G..."
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="px-4 py-2 text-white transition-colors border rounded-lg font-mono text-sm bg-zinc-950 border-zinc-700 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm font-medium text-zinc-400">
            Amount (XLM/USDC)
          </label>
          <input
            id="amount"
            type="number"
            required
            min="1"
            placeholder="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="px-4 py-2 text-white transition-colors border rounded-lg bg-zinc-950 border-zinc-700 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 mt-4 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Create Payment"}
        </button>
      </form>
    </div>
  );
}