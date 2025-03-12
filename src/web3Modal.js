// Web3Modal.js
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

// Configure provider options
const providerOptions = {
  injected: {
    // This allows MetaMask, OKX Wallet, and any other injected wallet extension
    display: {
      name: "MetaMask/OKX Wallet",  // Shown in the Web3Modal UI
      description: "Connect with MetaMask or OKX Wallet"
    },
    package: null, // The browser extension automatically injects the provider
  },
  walletconnect: {
    package: WalletConnectProvider, // Needed for mobile or external wallets
    options: {
      infuraId: "INFURA_ID", // If using WalletConnect, Infura is still needed here
      rpc: {
        1: "https://mainnet.infura.io/v3/INFURA_ID",
        5: "https://goerli.infura.io/v3/INFURA_ID",
      }
    }
  }
};

// Create Web3Modal instance
const web3Modal = new Web3Modal({
  network: "mainnet", // Default network (adjust as needed)
  cacheProvider: true, // Enable caching of the provider
  providerOptions,    // Provider options defined above
});

export default web3Modal;
