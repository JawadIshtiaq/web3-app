import React, { useState, useEffect } from "react";
import { isAddress } from "ethers";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";

function ManualDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { manualAddress } = location.state || {};
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!manualAddress) {
      // Redirect back if no manual address was provided
      navigate("/");
    } else {
      fetchTransactionHistory(manualAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualAddress]);

  const fetchTransactionHistory = async (walletAddress) => {
    if (!isAddress(walletAddress)) {
      alert("Invalid Ethereum address.");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer ory_at_Ds3cXxbarm_SktddM1pX-2Gvb0zBzAYHoPeaOYY7mDw.XVZoxpj6BC9iHxSpQLEPqykTxCvSfRuBqEb8kB28Lpg"
    );

    const variables = {
      limit: 10,
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
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  return (
    <div className="container">
      <h1 className="title">Manual Dashboard</h1>
      <p>Showing transactions for: {manualAddress}</p>
      <div className="analytics">
        <h2>Transaction History</h2>
        {transactions.length > 0 ? (
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
