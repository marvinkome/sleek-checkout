import { h, Fragment } from "preact";
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
        return <p>Checking balance</p>;
      }
      case "not-enough-balance": {
        return (
          <Fragment>
            <p>Not enough balance to make this payment, try again with a different token</p>
            <br />
            <button onClick={() => goBack()}>Select different token</button>
          </Fragment>
        );
      }
      case "confirm-payment": {
        return (
          <Fragment>
            <p>You pay:</p>
            {/* TODO: Perform token price conversion */}
            <h5>
              {amount} {selectedToken.toUpperCase()}
            </h5>
            <p>You will receive 2 prompts from your wallet to approve and pay for this transaction.</p>
            <br />
            <button onClick={() => confirmPayment()}>Confirm payment</button>
          </Fragment>
        );
      }
      case "approving-tx": {
        return <p>Approving transaction...</p>;
      }
      case "making-payment": {
        return <p>Making payment...</p>;
      }
      case "payment-done": {
        return (
          <Fragment>
            <h5>Payment confirmed</h5>
            <a href={`${getBlockExplorer(chainId!)}tx/${transaction?.hash}`}>View receipt</a>
            <br />
            <button onClick={() => onSuccess!(transaction)}>Done</button>
          </Fragment>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      <p>Confirm payment here</p>
      <br />

      {renderBody()}
    </div>
  );
}

export default ConfirmPayment;
