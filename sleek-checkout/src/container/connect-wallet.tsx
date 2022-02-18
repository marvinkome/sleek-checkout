import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "../services/router";
import { SUPPORTED_WALLETS } from "../services/web3/connectors";
import { activateConnector } from "../services/web3/utils";

function ConnectWallet() {
  const [error, setError] = useState("");
  const { goForward } = useRouter();
  const { account, activate } = useWeb3React();

  useEffect(() => {
    if (account) {
      goForward();
    }
  }, [account]);

  const onSelect = async (e: any) => {
    const connector: any = Object.entries(SUPPORTED_WALLETS).find(([k]) => k === e.target.value);
    if (!connector) return;

    try {
      await activateConnector(activate, connector[1].connector);
      setError("");
    } catch (e) {
      setError("Error connecting wallet");
    }
  };

  return (
    <div>
      <p>Connect wallet here</p>
      <br />

      <select onChange={onSelect}>
        <option>Select wallet</option>
        {Object.keys(SUPPORTED_WALLETS)
          .filter((k) => k !== "INJECTED")
          .map((key) => (
            <option key={key} value={key}>
              {key.toLowerCase()}
            </option>
          ))}
      </select>

      <p>{error}</p>

      <br />
      <br />
    </div>
  );
}

export default ConnectWallet;
