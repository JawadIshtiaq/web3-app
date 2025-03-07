import React, { useState, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";
import web3Modal from "./web3Modal";
import axios from "axios";
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Connect to wallet
  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setNetwork(network.name);
      setBalance(formatEther(balance));

      // Fetch transaction history
      const txHistory = await fetchTransactionHistory(address);
      setTransactions(txHistory);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Fetch transaction history
  const fetchTransactionHistory = async (address) => {
    const url = "https://streaming.bitquery.io/graphql";
    const apiKey = "Bearer YOUR_BITQUERY_API_KEY"; // Replace with your Bitquery API key

    const payload = {
      query: `
        query ($network: evm_network, $limit: Int, $address: String!, $from: String, $till: String) {
          EVM(dataset: combined, network: $network) {
            Transactions(
              where: {Transaction: {From: {is: $address}}, Block: {Date: {since: $from, till: $till}}}
              orderBy: {descending: Block_Time}
              limit: {count: $limit}
            ) {
              count
              ChainId
              Block {
                Time
                Number
              }
              gas_cost: sum(of: Fee_SenderFee)
              gas_cost_usd: sum(of: Fee_SenderFeeInUSD)
              Transaction {
                Hash
                To
              }
              TransactionStatus {
                Success
              }
            }
          }
        }
      `,
      variables: {
        limit: 10, // Fetch the last 10 transactions
        network: "eth", // Ethereum network
        from: "2023-01-01", // Start date (adjust as needed)
        till: new Date().toISOString().split("T")[0], // End date (today)
        address: address, // Wallet address
      },
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
      });
      return response.data.data.EVM.Transactions; // Return transaction data
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      return [];
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    setProvider(null);
    setSigner(null);
    setAddress("");
    setBalance("");
    setNetwork("");
    setTransactions([]);
  };

  // Check cached provider on mount
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  return (
    <div className="container">
      <h1 className="title">Web3 Wallet Dashboard</h1>
      {address ? (
        <div className="dashboard">
          <div className="wallet-info">
            <h2>Wallet Information</h2>
            <p><strong>Address:</strong> <span className="address">{address}</span></p>
            <p><strong>Network:</strong> <span className="network">{network}</span></p>
            <p><strong>Balance:</strong> <span className="balance">{balance} ETH</span></p>
          </div>

          <div className="analytics">
            <h2>Transaction History</h2>
            {transactions.length > 0 ? (
              <div className="transactions">
                {transactions.map((tx, index) => (
                  <div key={index} className="transaction">
                    <p><strong>Hash:</strong> {tx.Transaction.Hash}</p>
                    <p><strong>To:</strong> {tx.Transaction.To}</p>
                    <p><strong>Status:</strong> {tx.TransactionStatus.Success ? "Success" : "Failed"}</p>
                    <p><strong>Gas Cost:</strong> {tx.gas_cost} ETH</p>
                    <p><strong>Gas Cost (USD):</strong> ${tx.gas_cost_usd}</p>
                    <p><strong>Block Time:</strong> {tx.Block.Time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No transactions found.</p>
            )}
          </div>

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