import { h } from "preact";
import { IoIosCheckmarkCircle } from "@react-icons/all-files/io/IoIosCheckmarkCircle";
import { FiFrown } from "@react-icons/all-files/fi/FiFrown";
import { useEffect, useState, useCallback, useMemo } from "preact/hooks";
import { useWeb3React } from "@web3-react/core";
import { parseUnits } from "@ethersproject/units";
import { useErc20, usePaymentContract } from "../hooks/web3";
import { useConfig } from "../services/config";
import { useRouter } from "../services/router";
import { getToken, getTokenAmount } from "../services/web3/utils";
import { getBlockExplorer } from "../services/web3/constants";

function ConfirmPayment({ selectedToken }: any) {
  const [view, setView] = useState("processing-payment");
  const [tokenAmount, setTokenAmount] = useState<string | null>(null);

  const [transaction, setTransaction] = useState<any>(null);

  const { goBack } = useRouter();
  const { account, chainId } = useWeb3React();
  const { amount, recipientAddress, onError, onSuccess, onClose } = useConfig();

  const erc20 = useErc20(selectedToken);
  const paymentContract = usePaymentContract();

  const checkBalance = useCallback(async () => {
    try {
      const token = getToken(selectedToken, chainId!);
      const balance = await erc20.balanceOf(account);

      const hasEnoughBalance = balance.gte(parseUnits(amount || "0", token.decimals));
      if (!hasEnoughBalance) {
        setView("not-enough-balance");
      }

      // side effect - fetch token amount
      const tokenAmount = await getTokenAmount(selectedToken, chainId!, amount || "0");
      setTokenAmount(tokenAmount);
    } catch (e) {
      setView("not-enough-balance");
    }
  }, [amount]);

  const fetchTokenPrice = useCallback(async () => {
    try {
      const tokenAmount = await getTokenAmount(selectedToken, chainId!, amount || "0");
      setTokenAmount(tokenAmount);

      setView("confirm-payment");
    } catch (e) {
      setView("failed-price-fetch");
    }
  }, [amount]);

  useEffect(() => {
    checkBalance();
    fetchTokenPrice();
  }, [selectedToken, amount]);

  const token = useMemo(() => getToken(selectedToken, chainId!), [selectedToken, chainId]);

  const confirmPayment = async () => {
    try {
      setView("approving-tx");
      const token = getToken(selectedToken, chainId!);

      const approveTx = await erc20.approve(paymentContract.address, parseUnits(amount!, token.decimals));
      await approveTx.wait();

      // set state that approve contract is done
      setView("making-payment");

      const tx = await paymentContract.makePayment(token.address, recipientAddress, parseUnits(amount!, token.decimals));
      await tx.wait();

      // set transaction in state
      // update ui to show receipt
      setView("payment-done");
      setTransaction(tx);

      onSuccess!({
        tx: transaction,
        chainId: chainId!,
        token: token,
        receipt: `${getBlockExplorer(chainId!)}tx/${transaction?.hash}`,
      });
    } catch (err) {
      // show errors in UI
      onError && onError(err);
      setView("payment-failed");
    }
  };

  const renderBody = () => {
    switch (view) {
      case "processing-payment": {
        return (
          <div class="w-full flex flex-col items-center justify-center py-10">
            <div class="loader" />
            <p class="text-sm mt-3">Processing...</p>
          </div>
        );
      }
      case "failed-price-fetch": {
        return (
          <div class="w-full flex flex-col items-center justify-center py-8">
            <FiFrown className="text-[3rem] mb-8 text-gray-300" />

            <p class="text-sm text-gray-500 text-center mb-8">Can't get the price for this token</p>
            <button class="btn" onClick={() => goBack()}>
              Select another token
            </button>
          </div>
        );
      }
      case "not-enough-balance": {
        return (
          <div class="w-full flex flex-col items-center justify-center py-8">
            <FiFrown className="text-[3rem] mb-8 text-gray-300" />

            <p class="text-sm text-gray-500 text-center mb-8">Not enough balance to make this transaction</p>
            <button class="btn" onClick={() => goBack()}>
              Select another token
            </button>
          </div>
        );
      }
      case "confirm-payment": {
        return (
          <div class="w-full flex flex-col px-6 pt-2 text-center">
            <p class="mb-2">You pay:</p>

            {/* TODO: Perform token price conversion */}
            <h5 class="flex items-center justify-center font-semibold text-2xl mb-4 pb-4 border-b border-dashed border-slate-300">
              <img class="inline w-[25px] mr-2" src={token.icon} />
              {tokenAmount || amount} {selectedToken.toUpperCase()}
            </h5>

            <p class="text-sm text-gray-500 my-10">Your wallet will prompt you twice to approve and pay for this transaction.</p>

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
              <p class="text-sm mt-5 text-gray-500">
                Approve the first transaction to spend{" "}
                <span class="font-medium">
                  {amount} {selectedToken.toUpperCase()}
                </span>
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
              <p class="text-sm mt-5 text-gray-500">Making payment now...</p>
            </div>
          </div>
        );
      }
      case "payment-done": {
        return (
          <div class="w-full flex flex-col items-center justify-center pt-10">
            <IoIosCheckmarkCircle className="text-5xl text-emerald-500" />

            <div class="my-8 text-center">
              <h5 class="font-semibold text-lg mb-3">Payment Successful!</h5>
              <a class="text-sm underline" target="_blank" href={`${getBlockExplorer(chainId!)}tx/${transaction?.hash}`}>
                View receipt
              </a>
            </div>

            <button class="btn" onClick={() => onClose!()}>
              Done
            </button>
          </div>
        );
      }
      case "payment-failed": {
        return (
          <div class="w-full flex flex-col items-center justify-center py-8">
            <FiFrown className="text-[3rem] mb-8 text-gray-300" />

            <p class="text-sm text-gray-500 text-center mb-8">Something went wrong. Your tokens are safe.</p>
            <button class="btn" onClick={() => setView("confirm-payment")}>
              Try Again
            </button>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return <main class="mb-auto flex flex-1 flex-col justify-center py-6 px-10">{renderBody()}</main>;
}

export default ConfirmPayment;
