import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  // first item is default chain
  supportedChainIds: [4], // todo: add more chains, make Bsc default chain
});

export const walletconnect = new WalletConnectConnector({
  infuraId: "4f88abdfd94a43c684fa93091d00515e",
  qrcode: true,
  pollingInterval: 12000,
  storageId: "custom-wc",
});

export const SUPPORTED_WALLETS: any = {
  INJECTED: {
    connector: injected,
    name: "Injected",
    isAuthorized: () => injected.isAuthorized(),
  },
  METAMASK: {
    connector: injected,
    name: "Metamask",
    label: "Connect with MetaMask",
    iconUrl: "/wallets/metamask.png",
    isAuthorized: () => injected.isAuthorized(),
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: "WalletConnect",
    iconUrl: "/wallets/walletconnect.svg",
    label: "Connect with Wallet Connect",
    isAuthorized: async () => {
      try {
        return !!(await walletconnect.getAccount());
      } catch (err) {
        return false;
      }
    },
  },
};
