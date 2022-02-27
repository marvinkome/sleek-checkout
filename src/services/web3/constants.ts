// @ts-ignore
export const isDev = !!__DEV__;

export const ACCEPTED_TOKENS = {
  usdc: (chainId: number) => {
    const addresses = {
      137: {
        address: "",
        icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=021",
        decimals: 0,
      },
      56: {
        address: "",
        icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=021",
        decimals: 0,
      },
    };

    if (isDev) {
      addresses[4] = {
        address: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
        icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=021",
        decimals: 6,
      };
    }

    return addresses[chainId];
  },

  usdt: (chainId: number) => {
    const addresses = {
      137: {
        address: "",
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=021",
        decimals: 0,
      },
      56: {
        address: "",
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=021",
        decimals: 0,
      },
    };

    if (isDev) {
      addresses[4] = {
        address: "0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02",
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=021",
        decimals: 18,
      };
    }

    return addresses[chainId];
  },

  dai: (chainId: number) => {
    const addresses = {
      137: {
        address: "",
        icon: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=021",
        decimals: 0,
      },
      56: {
        address: "",
        icon: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=021",
        decimals: 0,
      },
    };

    if (isDev) {
      addresses[4] = {
        address: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
        icon: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=021",
        decimals: 18,
      };
    }

    return addresses[chainId];
  },
};

export const SUPPORTED_CHAINS = [
  isDev
    ? {
        name: "Rinkeby",
        chainId: 4,
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=021",
        explorer: "https://rinkeby.etherscan.io/",
        rpcUrl: "https://rinkeby.infura.io/v3/5943db108ab24508875f5d1cedb61636",
        coingeckoId: `ethereum`,
      }
    : null,
  {
    name: "Binance",
    chainId: 56,
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=021",
    explorer: "https://bscscan.com/",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    coingeckoId: `binance-smart-chain`,
  },

  {
    name: "Polygon (Matic)",
    chainId: 137,
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=021",
    explorer: "https://polygonscan.com/",
    rpcUrl: "https://polygon-rpc.com/",
    coingeckoId: `polygon-pos`,
  },
].filter(Boolean);

export const getPaymentContractAddress = (chainId: number) => {
  switch (chainId) {
    case 4:
      return "0x5BDDe37055a5f34619fC6F2A7535D2c86f5Cf9d6";
    case 137:
      return "0xB3d5e6B2bCaA6B20E0D8C62d8E85c85bd0d48aCA";
    case 56:
      return "0x1DDbEC9CC97704F7A142BAFD225fB63146aEd10A";
    default:
      throw Error("Chain ID not supported");
  }
};

export const getBlockExplorer = (chainId: number) => {
  const chain = SUPPORTED_CHAINS.find((c) => c?.chainId === chainId);
  if (!chain) {
    throw Error("Network not supported");
  }

  return chain.explorer;
};
