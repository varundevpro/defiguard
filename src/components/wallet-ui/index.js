import React, { useState, useEffect } from "react";
import Web3 from "web3";
import NotConnected from "./NotConnected";
import ConnectedWallet from "./ConnectedWallet";

export default function WalletUI() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (err) {
          console.error("Could not fetch accounts:", err);
        }
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getBalance = async () => {
      if (web3 && account) {
        try {
          const wei = await web3.eth.getBalance(account);
          const eth = web3.utils.fromWei(wei, "ether");
          setBalance(parseFloat(eth).toFixed(4));
        } catch (err) {
          console.error("Failed to get balance:", err);
          setError("Failed to fetch balance. Please try again.");
        }
      }
    };
    getBalance();
  }, [web3, account]);

  /**
   * Connects the user's wallet (e.g., MetaMask).
   */
  const connectWallet = async () => {
    setError("");
    if (window.ethereum) {
      try {
        setWeb3((instance) => instance || new Web3(window.ethereum));

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User denied account access", err);
        setError("Connection rejected. Please connect your wallet to proceed.");
      }
    } else {
      setError("MetaMask not detected. Please install the MetaMask extension.");
    }
  };

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <div className="wallet-ui bg-light d-flex align-items-center justify-content-center w-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-lg rounded-4 border-0">
              <div className="card-body p-4 p-md-5">
                {account ? (
                  <ConnectedWallet
                    account={account}
                    balance={balance}
                    web3={web3}
                    updateBalance={updateBalance}
                  />
                ) : (
                  <NotConnected
                    connectWallet={connectWallet}
                    error={error}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}