import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, formatEther } from "ethers";
import web3Modal from "./web3Modal";
import "./App.css";

function Home() {
  const [manualAddress, setManualAddress] = useState("");
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new BrowserProvider(instance);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(walletAddress);

      const walletData = {
        walletAddress,
        network: network.name,
        balance: formatEther(balance),
      };

      // Navigate to Wallet Dashboard passing walletData
      navigate("/wallet-dashboard", { state: { walletData } });
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleManualAddressSubmit = () => {
    if (manualAddress.trim()) {
      navigate("/manual-dashboard", { state: { manualAddress } });
    } else {
      alert("Please enter a wallet address.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Web3 Dashboard Home</h1>
      <div>
        <button onClick={handleConnectWallet} className="button connectButton">
          Connect Wallet
        </button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter wallet address manually"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          className="wallet-input"
        />
        <button onClick={handleManualAddressSubmit} className="button submitButton">
          Fetch Manual Transactions
        </button>
      </div>
    </div>
  );
}

export default Home;
