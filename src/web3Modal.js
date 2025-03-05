import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

// Configure provider options
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "71fa40c47d0c440d9eb7ab84788b0a0b",
      rpc: {
        1: "https://mainnet.infura.io/v3/71fa40c47d0c440d9eb7ab84788b0a0b",
        5: "https://goerli.infura.io/v3/71fa40c47d0c440d9eb7ab84788b0a0b",
        // ...other networks if needed
      }, // Replace with your Infura ID
    },
  },
  coinbasewallet: {
    package: require("@coinbase/wallet-sdk"), // Add Coinbase Wallet
    options: {
      appName: "Web3 App", // Your app name
      infuraId: "71fa40c47d0c440d9eb7ab84788b0a0b", // Replace with your Infura ID
    },
  },
};

// Create Web3Modal instance
const web3Modal = new Web3Modal({
  network: "mainnet", // Default network
  cacheProvider: true, // Enable caching
  providerOptions, // Add provider options
});

export default web3Modal;