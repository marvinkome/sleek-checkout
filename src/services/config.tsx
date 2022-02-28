import { h, createContext } from "preact";
import { useContext } from "preact/hooks";

const ConfigContext = createContext<{
  amount?: string;
  recipientAddress?: string;
  onClose?: () => Promise<void>;
  onSuccess?: (data: { tx: any; chainId: number; token: any; receipt: string }) => Promise<void>;
  onError?: (e: Error) => Promise<void>;
}>({});

export function useConfig() {
  return useContext(ConfigContext);
}

export function ConfigProvider({ config, ...props }: any) {
  const cleanup = () => {
    // remove walletconnect from localstorage
    localStorage.removeItem("sleek-wc");
  };

  const value = {
    ...config,
    onClose: async () => {
      // perform any cleanup here
      cleanup();

      if (config.onClose) await config.onClose();
    },

    onError: async (e: Error) => {
      if (config.onError) await config.onError(e);
    },

    onSuccess: async (...args: any[]) => {
      if (config.onSuccess) await config.onSuccess(...args);
    },
  };

  return <ConfigContext.Provider value={value}>{props.children}</ConfigContext.Provider>;
}
