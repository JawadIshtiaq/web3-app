import React, { useState, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";
import web3Modal from "./web3Modal";
import "./App.css"; // Import the CSS file

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  // Connect to wallet
  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setProvider(provider);
      setSigner(signer);
      setAddress(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      console.log("Error connecting wallet:", error);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    setProvider(null);
    setSigner(null);
    setAddress("");
    setBalance("");
  };

  // Fetch balance
  const getBalance = async () => {
    if (provider && address) {
      const balance = await provider.getBalance(address);
      setBalance(formatEther(balance));
    }
  };

  // Check cached provider on mount
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  // Update balance when address changes
  useEffect(() => {
    if (address) {
      getBalance();
    }
  }, [address]);

  return (
    <div className="container">
      <h1 className="title">Web3 Wallet Connection</h1>
      {address ? (
        <div>
          <p className="text">Connected Address: <span className="address">{address}</span></p>
          <p className="text">Balance: <span className="balance">{balance} ETH</span></p>
          <button 
            onClick={disconnectWallet}
            className="button disconnectButton"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="button connectButton"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;