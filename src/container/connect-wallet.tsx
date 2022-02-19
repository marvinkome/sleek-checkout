import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useRouter } from "../services/router";
import { SUPPORTED_WALLETS } from "../services/web3/connectors";
import { activateConnector } from "../services/web3/utils";
import { Select } from "../components/select";

function ConnectWallet({ chainId }: any) {
  const [error, setError] = useState<string | null>(null);
  const { goForward } = useRouter();
  const { account, activate } = useWeb3React();

  useEffect(() => {
    if (account) {
      goForward();
    }
  }, [account]);

  const onSelect = async (value: string) => {
    const walletKey = Object.keys(SUPPORTED_WALLETS).find((key) => key === value);
    if (!walletKey) return;

    const wallet = SUPPORTED_WALLETS[walletKey];
    if (!wallet) return;

    const connector = wallet.connector(chainId);

    try {
      setError(null);
      await activateConnector(activate, connector, chainId);
    } catch (e) {
      if (e instanceof UnsupportedChainIdError) {
        return setError("unsupported-chain");
      }

      console.error("SleekCheckout: Error connecting wallet", e);
      setError("general-error");
    }
  };

  const options = Object.keys(SUPPORTED_WALLETS)
    .map((walletKey) => {
      const wallet = SUPPORTED_WALLETS[walletKey];

      return {
        name: walletKey,
        label: wallet.label,
        image: wallet.iconUrl,
        onSelect,
      };
    })
    .filter(Boolean);

  const renderError = () => {
    switch (error) {
      case "unsupported-chain":
        // todo: add link to doc on supported chains
        return "Error connecting wallet, please select a different network.";
      default:
        return "Error connecting wallet, please try again with a different option.";
    }
  };

  return (
    <div>
      <h4 class="block text-sm mb-3">Select wallet to continue</h4>

      <Select options={options} />

      {error && <p class="text-sm mt-5 text-red-700">{renderError()}</p>}
    </div>
  );
}

export default ConnectWallet;
