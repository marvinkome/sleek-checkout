import { h, createContext } from "preact";
import { useContext, useErrorBoundary } from "preact/hooks";

const ConfigContext = createContext<{
  amount?: string;
  recipientAddress?: string;
  onClose?: () => Promise<void>;
  onSuccess?: (tx: any) => Promise<void>;
  onError?: (e: Error) => Promise<void>;
}>({});

export function useConfig() {
  return useContext(ConfigContext);
}

export function ConfigProvider({ config, ...props }: any) {
  const cleanup = () => {
    // remove walletconnect from localstorage
    localStorage.removeItem("custom-wc");
  };

  const value = {
    ...config,
    onClose: async () => {
      // perform any cleanup here
      cleanup();

      console.log(config.onClose);
      if (config.onClose) await config.onClose();
    },

    onError: async (e: Error) => {
      // perform any cleanup here
      cleanup();

      if (config.onClose) await config.onClose();
      if (config.onError) await config.onError(e);
    },

    onSuccess: async (tx: any) => {
      // perform any cleanup here
      cleanup();

      if (config.onClose) await config.onClose();
      if (config.onSuccess) await config.onSuccess(tx);
    },
  };

  useErrorBoundary((e) => value.onError(e));
  return <ConfigContext.Provider value={value}>{props.children}</ConfigContext.Provider>;
}
