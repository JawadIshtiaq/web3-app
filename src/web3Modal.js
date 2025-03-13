import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  injected: {
    // This allows MetaMask, OKX Wallet, and any other injected wallet extension
    display: {
      name: "MetaMask/OKX Wallet", 
      description: "Connect with MetaMask or OKX Wallet"
    },
    package: null, // The browser extension automatically injects the provider
  },
  walletconnect: {
    package: WalletConnectProvider, // Needed for mobile or external wallets
    options: {
      infuraId: "71fa40c47d0c440d9eb7ab84788b0a0b", // Infura ID is required
      rpc: {
        1: "https://mainnet.infura.io/v3/71fa40c47d0c440d9eb7ab84788b0a0b",
        5: "https://goerli.infura.io/v3/71fa40c47d0c440d9eb7ab84788b0a0b",
      }
    }
  }
};

// Create Web3Modal instance
const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions,    
});

export default web3Modal;
