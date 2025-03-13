import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  injected: {
    // This allows MetaMask, OKX Wallet, and any other injected wallet extension
    display: {
      name: "MetaMask/OKX Wallet", 
      description: "Connect with MetaMask or OKX Wallet"
    },
    package: null,
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
  network: "mainnet",
  cacheProvider: true,
  providerOptions,    
});

export default web3Modal;
