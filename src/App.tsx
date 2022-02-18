import { h } from "preact";
import { useState } from "preact/hooks";
import { StyleSheetManager } from "styled-components";
import { Web3ReactProvider } from "@web3-react/core";
import { Layout } from "./components/layout";
import { RouterProvider, Route } from "./services/router";
import { ConfigProvider } from "./services/config";
import { getLibrary } from "./services/web3/utils";

// pages
import ConnectWallet from "./container/connect-wallet";
import SelectToken from "./container/select-token";
import ConfirmPayment from "./container/confirm-payment";

export const App = ({ root, ...config }: any) => {
  const [selectedToken, setSelectedToken] = useState(null);

  return (
    <StyleSheetManager target={root}>
      <ConfigProvider config={config}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <RouterProvider initialRouteId={0}>
            <Layout maxPages={3}>
              <Route routeId={0} component={<ConnectWallet />} />
              <Route routeId={1} component={<SelectToken selectedToken={selectedToken} setSelectedToken={setSelectedToken} />} />
              <Route routeId={2} component={<ConfirmPayment selectedToken={selectedToken} />} />
            </Layout>
          </RouterProvider>
        </Web3ReactProvider>
      </ConfigProvider>
    </StyleSheetManager>
  );
};
