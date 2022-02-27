import { h } from "preact";
import clx from "classnames";
import { useEffect, useState } from "preact/hooks";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useRouter } from "../services/router";
import { SUPPORTED_WALLETS } from "../services/web3/connectors";
import { activateConnector } from "../services/web3/utils";

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
    <main class="mb-auto flex flex-col justify-center py-6 px-6">
      <h4 class="block mb-5 text-center font-medium">Connect your wallet</h4>

      <div>
        {options?.map((option) => (
          <div class="relative mb-4" key={option?.name}>
            <button
              type="button"
              class={clx([
                "relative",
                "w-full",
                "bg-white",
                "border",
                "border-gray-300",
                "rounded-md",
                "shadow-sm",
                "px-10",
                "py-6",
                "text-left",
                "cursor-pointer",
                "focus:outline-none",
                "focus:ring-1",
                "focus:ring-gray-500",
                "focus:border-gray-500",
                "hover:border-gray-500",
                "sm:text-sm",
              ])}
              aria-haspopup="listbox"
              aria-expanded="true"
              aria-labelledby="listbox-label"
              onClick={() => option?.onSelect(option?.name)}
            >
              <span class="flex flex-col justify-center items-center">
                <img src={option?.image} alt={option?.label} className="flex-shrink-0 h-6 w-6 rounded-full mb-3" />
                <span className="block truncate">{option?.label}</span>
              </span>
            </button>
          </div>
        ))}
      </div>

      {error && <p class="text-sm mt-5 text-red-700">{renderError()}</p>}
    </main>
  );
}

export default ConnectWallet;
