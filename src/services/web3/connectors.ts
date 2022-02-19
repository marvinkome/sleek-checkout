import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { SUPPORTED_CHAINS } from "./constants";

export const SUPPORTED_WALLETS = {
  metamask: {
    connector: (chainId: number) =>
      new InjectedConnector({
        supportedChainIds: [chainId],
      }),
    name: "Metamask",
    label: "Connect with MetaMask",
    iconUrl: "https://docs.metamask.io/metamask-fox.svg",
  },

  walletConnect: {
    connector: (chainId: number) =>
      new WalletConnectConnector({
        rpc: {
          [chainId]: SUPPORTED_CHAINS.find((c) => c?.chainId === chainId)?.rpcUrl || "",
        },
        supportedChainIds: [chainId],
        qrcode: true,
        pollingInterval: 12000,
        storageId: "sleek-wc",
      }),
    name: "Wallet Connect",
    iconUrl:
      "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/492d95c038bbcde1517cab5fb90ed4514690e919/svg/original/walletconnect-logo.svg",
    label: "Connect with Wallet Connect",
  },
};
