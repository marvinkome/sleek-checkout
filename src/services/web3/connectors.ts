import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  // first item is default chain
  supportedChainIds: [4, 1], // todo: add more chains, make Bsc default chain
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
    label: "Connect with MetaMask",
    iconUrl: "https://docs.metamask.io/metamask-fox.svg",
    isAuthorized: () => injected.isAuthorized(),
  },
  METAMASK: {
    connector: injected,
    name: "Metamask",
    label: "Connect with MetaMask",
    iconUrl: "https://docs.metamask.io/metamask-fox.svg",
    isAuthorized: () => injected.isAuthorized(),
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: "Wallet Connect",
    iconUrl:
      "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/492d95c038bbcde1517cab5fb90ed4514690e919/svg/original/walletconnect-logo.svg",
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
