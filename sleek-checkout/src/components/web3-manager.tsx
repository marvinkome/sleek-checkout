import { h } from "preact";
import styled from "styled-components";
import { useState, useEffect } from "preact/hooks";
import { useWeb3React } from "@web3-react/core";
import { SUPPORTED_WALLETS } from "../services/web3/connectors";
import { activateConnector } from "../services/web3/utils";

const WalletWarning = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0px;
`;

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    let fn = async () => {
      const connectors = Object.entries(SUPPORTED_WALLETS).map(([_, connector]: any) => connector);

      for (let connector of connectors) {
        if (await connector.isAuthorized()) {
          activateConnector(activate, connector.connector).catch(() => {});
          break;
        }
      }

      setTried(true);
    };

    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function Web3ReactManager(props: any) {
  // try to eagerly connect to an default connector, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!triedEager) {
    return (
      <WalletWarning>
        <p>Loading...</p>
      </WalletWarning>
    );
  }

  return props.children;
}
