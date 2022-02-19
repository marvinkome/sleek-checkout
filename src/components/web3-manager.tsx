import { useEffect } from "preact/hooks";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useRouter } from "../services/router";

function useWeb3Listener() {
  const { account, library, chainId, error } = useWeb3React();
  const { goToRoute } = useRouter();

  useEffect(() => {
    if (!account) {
      console.debug("no account");
      return goToRoute(0);
    }

    if (error instanceof UnsupportedChainIdError) {
      console.debug("bad chain id");
      return goToRoute(0);
    }
  }, [account, library, chainId]);
}

export function Web3ReactManager(props: any) {
  // add listeners and error handlers for each of the supported wallets
  useWeb3Listener();

  return props.children;
}
