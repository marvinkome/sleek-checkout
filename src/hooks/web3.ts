import { Contract } from "@ethersproject/contracts";
import { isAddress } from "@ethersproject/address";
import { useWeb3React } from "@web3-react/core";
import { ACCEPTED_TOKENS, getPaymentContractAddress } from "../services/web3/constants";
import { getToken } from "../services/web3/utils";
import erc20Abi from "../abi/erc20.json";
import paymentAbi from "../abi/payment.json";

export function useErc20(tokenName: string) {
  const { library, account, chainId } = useWeb3React();

  if (!library || !account) {
    throw new Error("Wallet not connected");
  }

  const tokenKey = Object.keys(ACCEPTED_TOKENS).find((k) => k.toLowerCase() === tokenName.toLowerCase());
  if (!tokenKey) {
    throw new Error("Token not found");
  }

  const token = getToken(tokenName, chainId!);

  let provider = library.getSigner(account).connectUnchecked();

  return new Contract(token.address, erc20Abi.abi, provider);
}

export function usePaymentContract() {
  const { library, account, chainId } = useWeb3React();

  if (!library || !account) {
    throw new Error("Wallet not connected");
  }

  const address = getPaymentContractAddress(chainId!);
  if (!isAddress(address)) {
    throw new Error("Chain not supported");
  }

  let provider = library.getSigner(account).connectUnchecked();
  return new Contract(address, paymentAbi.abi, provider);
}
