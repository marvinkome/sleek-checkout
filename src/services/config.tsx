import { h, createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";

const ConfigContext = createContext<{
  amount?: string;
  recipientAddress?: string;
  onClose?: (e?: Error) => Promise<void>;
}>({});

export function useConfig() {
  return useContext(ConfigContext);
}

export function ConfigProvider({ config, paymentData, ...props }: any) {
  const cleanup = () => {
    // remove walletconnect from localstorage
    localStorage.removeItem("sleek-wc");
  };

  const value = useMemo(
    () => ({
      ...config,
      onClose: async (e?: any) => {
        // perform any cleanup here
        cleanup();
        if (config.onClose) await config.onClose();

        if (paymentData) {
          if (config.onSuccess) await config.onSuccess(paymentData);
        } else {
          if (config.onError) await config.onError(e || new Error("Payment modal closed"));
        }
      },
    }),
    [paymentData]
  );

  return <ConfigContext.Provider value={value}>{props.children}</ConfigContext.Provider>;
}
