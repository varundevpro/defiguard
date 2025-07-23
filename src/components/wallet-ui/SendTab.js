import React, { useState } from "react";

export default function SendTab({ web3, account, updateBalance }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipient = e.target.elements.recipient.value;
    const amount = e.target.elements.amount.value;

    if (!web3 || !account) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!recipient || !amount) {
      setError("Please fill in both the recipient address and the amount.");
      return;
    }
    if (!web3.utils.isAddress(recipient)) {
      setError("Invalid recipient address.");
      return;
    }

    setError("");
    setLoading(true);
    setTxHash("");

    try {
      const amountInWei = web3.utils.toWei(amount, "ether");
      const tx = {
        from: account,
        to: recipient,
        value: amountInWei,
      };

      const receipt = await web3.eth.sendTransaction(tx);
      setTxHash(receipt.transactionHash);

      const wei = await web3.eth.getBalance(account);
      updateBalance(parseFloat(web3.utils.fromWei(wei, "ether")).toFixed(4));

      e.target.elements.recipient.value = "";
      e.target.elements.amount.value = "";
    } catch (err) {
      console.error("Transaction failed:", err);

      setError(err.message.split("\n")[0] || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="recipient"
            className="form-label small fw-medium text-muted"
          >
            Recipient Address
          </label>
          <input
            id="recipient"
            name="recipient"
            type="text"
            placeholder="0x..."
            className="form-control form-control-lg"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="form-label small fw-medium text-muted"
          >
            Amount (ETH)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            placeholder="0.0"
            className="form-control form-control-lg"
            step="any"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-100 btn btn-success btn-lg d-flex align-items-center justify-content-center"
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Sending...
            </>
          ) : (
            "Send ETH"
          )}
        </button>
      </form>

      {error && (
        <p className="text-danger mt-4 small text-center">
          {error}
        </p>
      )}
      {txHash && (
        <div className="mt-4 text-center alert alert-success">
          <p className="fw-bold mb-1">Transaction Successful!</p>
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="small text-break"
          >
            View on Etherscan
          </a>
        </div>
      )}
    </div>
  );
}