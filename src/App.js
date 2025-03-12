// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import WalletDashboard from "./WalletDashboard";
import ManualDashboard from "./ManualDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wallet-dashboard" element={<WalletDashboard />} />
        <Route path="/manual-dashboard" element={<ManualDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
