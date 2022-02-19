import { UnsupportedChainIdError } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { ACCEPTED_TOKENS } from "./constants";

export async function switchNetwork(chainId: number) {
  const { ethereum } = global as any;
  if (!ethereum) {
    console.log("MetaMask extension not available");
    return;
  }

  await ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
  });
}

export async function activateConnector(activateFn: any, connector: any, chainId: number) {
  if (!activateFn) throw Error("no activation function passed");
  if (!connector) return;

  try {
    // remove wallet connect from storage
    localStorage.removeItem("sleek-wc");
    await activateFn(connector, undefined, true);
  } catch (err) {
    if (err instanceof UnsupportedChainIdError) {
      console.log("Trying to switch network");
      await switchNetwork(chainId);
      await activateFn(connector, undefined, true);
    } else {
      throw err;
    }
  }
}

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);

  library.pollingInterval = 12000;
  return library;
}

export function getToken(tokenName: string, chainId: number) {
  const tokenKey = Object.keys(ACCEPTED_TOKENS).find((k) => k.toLowerCase() === tokenName.toLowerCase());
  if (!tokenKey) {
    throw new Error("Token not found");
  }

  const token = ACCEPTED_TOKENS[tokenKey](chainId);
  if (!isAddress(token.address) || token.address === AddressZero) {
    throw new Error("Token not yet implemented");
  }

  return token;
}
