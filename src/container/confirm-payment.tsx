import { h } from "preact";
import { IoIosCheckmarkCircle } from "@react-icons/all-files/io/IoIosCheckmarkCircle";
import { useEffect, useState, useCallback } from "preact/hooks";
import { useWeb3React } from "@web3-react/core";
import { parseUnits } from "@ethersproject/units";
import { BigNumber } from "bignumber.js";
import { useErc20, usePaymentContract } from "../hooks/web3";
import { useConfig } from "../services/config";
import { useRouter } from "../services/router";
import { getToken } from "../services/web3/utils";
import { getBlockExplorer } from "../services/web3/constants";

function ConfirmPayment({ selectedToken }: any) {
  const [view, setView] = useState("checking-balance");

  const [transaction, setTransaction] = useState<any>(null);

  const { goBack } = useRouter();
  const { account, chainId } = useWeb3React();
  const { amount, recipientAddress, onError, onSuccess } = useConfig();

  const erc20 = useErc20(selectedToken);
  const paymentContract = usePaymentContract();

  const checkBalance = useCallback(async () => {
    try {
      const token = getToken(selectedToken, chainId!);
      const balance = new BigNumber((await erc20.balanceOf(account)).toString()).dividedBy(`1e${token.decimals}`);

      const hasEnoughBalance = balance.isGreaterThanOrEqualTo(amount || "0");
      setView(hasEnoughBalance ? "confirm-payment" : "not-enough-balance");
    } catch (e) {
      setView("not-enough-balance");
    }
  }, [amount]);

  useEffect(() => {
    checkBalance();
  }, [selectedToken, amount]);

  const confirmPayment = async () => {
    try {
      setView("approving-tx");
      const token = getToken(selectedToken, chainId!);

      const approveTx = await erc20.approve(paymentContract.address, parseUnits(amount!, token.decimals));
      await approveTx.wait();

      // set state that approve contract is done
      setView("making-payment");
      // set timeout to update ui

      const tx = await paymentContract.receivePayment(token.address, recipientAddress, parseUnits(amount!, token.decimals));
      await tx.wait();

      // set transaction in state
      // update ui to show receipt
      setView("payment-done");
      setTransaction(tx);
    } catch (err) {
      onError && onError(err);
    }
  };

  const renderBody = () => {
    switch (view) {
      case "checking-balance": {
        return (
          <div class="w-full flex flex-col items-center justify-center py-10">
            <div class="loader" />
            <p class="text-sm mt-3">Checking balance...</p>
          </div>
        );
      }
      case "not-enough-balance": {
        return (
          <div class="w-full flex flex-col items-center justify-center py-6">
            <p class="text-sm text-center mb-5">Not enough balance to make this payment, try again with a different token</p>
            <button class="btn" onClick={() => goBack()}>
              Select different token
            </button>
          </div>
        );
      }
      case "confirm-payment": {
        return (
          <div class="w-full flex flex-col pt-2">
            <p class="text-sm mb-1">You pay:</p>

            {/* TODO: Perform token price conversion */}
            <h5 class="font-semibold text-xl mb-3">
              {amount} {selectedToken.toUpperCase()}
            </h5>

            <p class="text-sm text-gray-600 mb-5">You will receive 2 prompts from your wallet to approve and pay for this transaction.</p>

            <button class="btn" onClick={() => confirmPayment()}>
              Confirm payment
            </button>
          </div>
        );
      }
      case "approving-tx": {
        return (
          <div class="w-full flex flex-col items-center justify-center py-10 px-8">
            <div class="loader" />

            <div class="mt-5 text-center">
              <h5 class="font-bold text-xl">Hang Tight!</h5>
              <p class="text-sm mt-3">
                We're approving your wallet to spend {amount} {selectedToken.toUpperCase()}
              </p>
            </div>
          </div>
        );
      }
      case "making-payment": {
        return (
          <div class="w-full flex flex-col items-center justify-center py-10 px-8">
            <div class="loader" />

            <div class="mt-5 text-center">
              <h5 class="font-bold text-xl">Hang Tight!</h5>
              <p class="text-sm mt-3">Making payment now...</p>
            </div>
          </div>
        );
      }
      case "payment-done": {
        return (
          <div class="w-full flex flex-col items-center justify-center pt-10">
            <IoIosCheckmarkCircle className="text-5xl text-emerald-500" />

            <div class="my-5 text-center">
              <h5 class="font-semibold text-lg">Payment Successful!</h5>
              <a class="text-sm underline" target="_blank" href={`${getBlockExplorer(chainId!)}tx/${transaction?.hash}`}>
                View receipt
              </a>
            </div>

            <button class="btn" onClick={() => onSuccess!(transaction)}>
              Done
            </button>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return <div>{renderBody()}</div>;
}

export default ConfirmPayment;
