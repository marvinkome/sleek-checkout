import { h } from "preact";
import { useErrorBoundary, useState } from "preact/hooks";
import { Web3ReactProvider } from "@web3-react/core";
import { Layout } from "./components/layout";
import { RouterProvider, Route } from "./services/router";
import { ConfigProvider } from "./services/config";
import { Web3ReactManager } from "./components/web3-manager";
import { getLibrary } from "./services/web3/utils";

// pages
import SelectNetwork from "./container/select-network";
import ConnectWallet from "./container/connect-wallet";
import SelectToken from "./container/select-token";
import ConfirmPayment from "./container/confirm-payment";

export const App = ({ root, ...config }: any) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const [error] = useErrorBoundary();

  return (
    <ConfigProvider config={config}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <RouterProvider initialRouteId={0}>
          <Web3ReactManager>
            <Layout maxPages={4} error={error}>
              <Route routeId={0} component={<SelectNetwork selectedNetwork={selectedNetwork} setSelectedNetwork={setSelectedNetwork} />} />
              <Route routeId={1} component={<ConnectWallet chainId={selectedNetwork} />} />
              <Route routeId={2} component={<SelectToken selectedToken={selectedToken} setSelectedToken={setSelectedToken} />} />
              <Route routeId={3} component={<ConfirmPayment selectedToken={selectedToken} />} />
            </Layout>
          </Web3ReactManager>
        </RouterProvider>
      </Web3ReactProvider>
    </ConfigProvider>
  );
};
