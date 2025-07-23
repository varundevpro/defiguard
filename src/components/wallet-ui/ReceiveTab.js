import React from "react";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const showMessage = async (text) => {
  const messageBox = document.createElement("div");
  messageBox.textContent = text;

  messageBox.style.position = "fixed";
  messageBox.style.bottom = "1rem";
  messageBox.style.right = "1rem";
  messageBox.style.backgroundColor = "#343a40";
  messageBox.style.color = "#ffffff";
  messageBox.style.padding = "0.75rem 1.25rem";
  messageBox.style.borderRadius = "0.5rem";
  messageBox.style.boxShadow = "0 0.5rem 1rem rgba(0, 0, 0, 0.15)";
  messageBox.style.zIndex = "1050";

  document.body.appendChild(messageBox);
  await sleep(2000);
  document.body.removeChild(messageBox);
};

const fallbackCopy = (text, callback) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // prevent scroll to bottom
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      callback("Address copied to clipboard!");
    } else {
      callback("Failed to copy address.");
    }
  } catch (err) {
    console.error("Fallback copy failed", err);
    callback("Copy not supported.");
  }

  document.body.removeChild(textarea);
};

export default function ReceiveTab({ account }) {
  const copyAddress = () => {
    if (!account) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(account)
        .then(() => showMessage("Address copied to clipboard!"))
        .catch((err) => {
          console.error("Clipboard copy failed", err);
          fallbackCopy(account, showMessage);
        });
    } else {
      fallbackCopy(account, showMessage);
    }
  };

  return (
    <div className="text-center">
      <h3 className="h5 fw-semibold text-dark p-0 mb-2">Your Wallet Address</h3>
      <p className="font-monospace text-secondary text-break mb-3">{account}</p>
      <div className="d-flex justify-content-center mb-3">
        {/* QR code generation using a public API */}
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${account}`}
          alt="Recipient QR Code"
          className="rounded-3 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/150x150/e0e0e0/000000?text=QR+Code+Unavailable";
          }}
          width={150}
          height={150}
        />
      </div>
      <button onClick={copyAddress} className="w-100 btn btn-light btn-lg">
        Copy Address
      </button>
      <p className="small text-muted mt-3">
        Share this address or QR code to receive ETH or any ERC-20 tokens on the
        Ethereum network.
      </p>
    </div>
  );
}
