import React from "react";

export default function NotConnected({ connectWallet, error }) {
  return (
    <div className="text-center">
      <h2 className="h2 fw-semibold text-secondary mb-3">
        Connect Your Wallet
      </h2>
      <p className="text-muted mb-4">
        Please connect your wallet to manage your assets.
      </p>
      <button
        onClick={connectWallet}
        className="btn btn-primary btn-lg shadow-sm d-inline-flex align-items-center gap-1"
      >
        <i className="fa-solid fa-wallet" aria-hidden="true"></i>
        Connect Wallet
      </button>
      {error && <p className="text-danger mt-4 small">{error}</p>}
    </div>
  );
}