import React, { useState } from "react";
import SendTab from "./SendTab";
import ReceiveTab from "./ReceiveTab";

export default function ConnectedWallet({ account, balance, web3, updateBalance }) {
  const [activeTab, setActiveTab] = useState("send");

  return (
    <div>
      <div className="text-center mb-4">
        <p className="fw-semibold text-muted m-0 mb-2">
          Connected Account
        </p>
        <p className="font-monospace text-truncate text-secondary m-0 mb-2">
          {account}
        </p>
        <p className="h4 fw-bold text-dark mt-1">{balance} ETH</p>
      </div>

      <ul className="nav nav-tabs nav-fill mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "send" ? "active" : ""
            }`}
            onClick={() => setActiveTab("send")}
          >
            Send
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "receive" ? "active" : ""
            }`}
            onClick={() => setActiveTab("receive")}
          >
            Receive
          </button>
        </li>
      </ul>

      {activeTab === "send" ? (
        <SendTab
          web3={web3}
          account={account}
          updateBalance={updateBalance}
        />
      ) : (
        <ReceiveTab account={account} />
      )}
    </div>
  );
}