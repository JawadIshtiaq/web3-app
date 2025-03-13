import React, { useState, useEffect } from "react";
import { isAddress } from "ethers";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";

function ManualDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { manualAddress } = location.state || {};
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!manualAddress) {
      navigate("/");
    } else {
      fetchTransactionHistory(manualAddress);
    }
  }, [manualAddress, navigate]);

  const fetchTransactionHistory = async (walletAddress) => {
    if (!isAddress(walletAddress)) {
      alert("Invalid Ethereum address.");
      return;
    }

    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer ory_at_oSiXosezVkv6PVa30ebosJ3Q97EmaB08M84NAEed8PQ.zzKmsI639uVqgHEh_mZtOL5Y9clqnf0k9xLcd_xNYqk"
    );

    const variables = {
      limit: 20,
      network: "eth",
      from: "2025-03-05", // Adjust as needed
      till: new Date().toISOString().split("T")[0],
      address: walletAddress,
      dateFormat: "%Y-%m-%d",
      date_middle: "2025-03-08",
      mempool: false,
    };

    const raw = JSON.stringify({
      query: `query ($network: evm_network, $limit: Int, $address: String!, $from: String, $till: String) {
  EVM(dataset: combined, network: $network) {
    Transactions(
      where: {Transaction: {From: {is: $address}}, Block: {Date: {since: $from, till: $till}}},
      orderBy: {descending: Block_Time},
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
}`,
      variables: JSON.stringify(variables),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://streaming.bitquery.io/graphql", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Manual API Response:", data);
        const txs = data.data?.EVM?.Transactions || [];
        setTransactions(txs);
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false); 
      });
  };

  return (
    <div className="container">
      <h1 className="title">Manual Dashboard</h1>
      <p>Showing transactions for: {manualAddress}</p>
      <div className="analytics">
        <h2>Transaction History</h2>
        {loading ? (
          <p>Fetching transactions...</p>
        ) : transactions.length > 0 ? (
          <div className="transactions">
            {transactions.map((tx, index) => (
              <div key={index} className="transaction">
                <p>
                  <strong>Hash:</strong> {tx.Transaction.Hash}
                </p>
                <p>
                  <strong>To:</strong> {tx.Transaction.To}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {tx.TransactionStatus.Success ? "Success" : "Failed"}
                </p>
                <p>
                  <strong>Gas Cost:</strong> {tx.gas_cost} ETH
                </p>
                <p>
                  <strong>Gas Cost (USD):</strong> ${tx.gas_cost_usd}
                </p>
                <p>
                  <strong>Block Time:</strong> {tx.Block.Time}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
}

export default ManualDashboard;
