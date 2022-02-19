// @ts-ignore
export const isDev = !!__DEV__;

export const ACCEPTED_TOKENS = {
  usdc: (chainId: number) => {
    const addresses = {
      1: {
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=021",
        decimals: 6,
      },
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
      1: {
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=021",
        decimals: 6,
      },

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
      1: {
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        icon: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=021",
        decimals: 18,
      },

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
  {
    name: "Ethereum",
    chainId: 1,
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=021",
    explorer: "https://etherscan.io/",
    rpcUrl: "https://mainnet.infura.io/v3/5943db108ab24508875f5d1cedb61636",
  },

  isDev
    ? {
        name: "Rinkeby",
        chainId: 4,
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=021",
        explorer: "https://rinkeby.etherscan.io/",
        rpcUrl: "https://rinkeby.infura.io/v3/5943db108ab24508875f5d1cedb61636",
      }
    : null,
  {
    name: "Binance",
    chainId: 56,
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=021",
    explorer: "https://bscscan.com/",
    rpcUrl: "https://bsc-dataseed.binance.org/",
  },

  {
    name: "Polygon (Matic)",
    chainId: 137,
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=021",
    explorer: "https://polygonscan.com/",
    rpcUrl: "https://polygon-rpc.com/",
  },
].filter(Boolean);

export const getPaymentContractAddress = (chainId: number) => {
  switch (chainId) {
    case 1:
      return "";
    case 4:
      return "0x5992752154e63Cd8368AE00eCcDB286E53f271C1";
    case 137:
      return "";
    case 56:
      return "";
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
