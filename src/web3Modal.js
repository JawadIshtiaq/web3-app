import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

// Configure provider options
const providerOptions = {
  injected: {
    // This allows MetaMask, OKX Wallet, and any other injected wallet extension
    display: {
      name: "MetaMask/OKX Wallet",  // This will be shown in the Web3Modal UI
      description: "Connect with MetaMask or OKX Wallet"
    },
    package: null, // No need for a package here, the browser extension automatically injects the provider
  },
  walletconnect: {
    package: WalletConnectProvider, // Only needed for mobile wallets or other external wallets
    options: {
      infuraId: "71fa40c47d0c440d9eb7ab84788b0a0b", // If using WalletConnect, Infura is still needed here
      rpc: {
        1: "https://mainnet.infura.io/v3/71fa40c47d0c440d9eb7ab84788b0a0b",
        5: "https://goerli.infura.io/v3/71fa40c47d0c440d9eb7ab84788b0a0b",
      }
    }
  }
};

// Create Web3Modal instance
const web3Modal = new Web3Modal({
  network: "mainnet", // Default network (you can change it as needed)
  cacheProvider: true, // Enable caching
  providerOptions, // Add provider options
});

export default web3Modal;
