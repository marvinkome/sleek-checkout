import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "../services/router";
import { SUPPORTED_WALLETS } from "../services/web3/connectors";
import { activateConnector } from "../services/web3/utils";
import { Select } from "../components/select";

function ConnectWallet() {
  const [error, setError] = useState(false);
  const { goForward } = useRouter();
  const { account, activate } = useWeb3React();

  useEffect(() => {
    if (account) {
      goForward();
    }
  }, [account]);

  const onSelect = async (value: string) => {
    const connector: any = Object.entries(SUPPORTED_WALLETS).find(([k]) => k === value);
    if (!connector) return;

    try {
      await activateConnector(activate, connector[1].connector);
      setError(false);
    } catch (e) {
      console.error("SleekCheck: Error connecting wallet", e);
      setError(true);
    }
  };

  const options = Object.keys(SUPPORTED_WALLETS)
    .map((walletKey) => {
      // @ts-ignore
      const isMetamask = window.ethereum && window.ethereum.isMetaMask;
      const wallet = SUPPORTED_WALLETS[walletKey];

      if (wallet.name === "Injected") {
        // @ts-ignore
        if (!(window.web3 || window.ethereum)) {
          return null;
        }

        // don't return metamask if injected provider isn't metamask
        else if (wallet.name === "MetaMask" && !isMetamask) {
          return null;
        }

        // likewise for generic
        else if (wallet.name === "Injected" && isMetamask) {
          return null;
        }
      }

      return {
        name: walletKey,
        label: wallet.label,
        image: wallet.iconUrl,
        onSelect,
      };
    })
    .filter(Boolean);

  return (
    <div>
      <h4 class="block text-sm mb-3">Select wallet to continue</h4>

      <Select options={options} />

      {error && <p class="text-sm mt-5 text-red-700">Error connecting wallet, please try again with a different option</p>}
    </div>
  );
}

export default ConnectWallet;
