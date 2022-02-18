import { h, render } from "preact";
import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { App } from "./App";

// main entry point - calls loader and render app into element
export function SleekCheckout(options: any) {
  // initialize functiions here
  options.debug && console.log(`Initiazlizing SleekCheckout with options: `, options);

  // verify amount
  if (isNaN(Number(options.amount)) || Number(options.amount) < 0) {
    throw new Error("Amount must be a positive number");
  }

  // verify recipient is a valid address
  if (!options.recipientAddress || !isAddress(options.recipientAddress) || options.recipientAddress === AddressZero) {
    throw new Error("Recipient must be a valid address");
  }

  const wrappingElement = window.document.body;
  const targetElement = wrappingElement.appendChild(window.document.createElement("section"));
  targetElement.setAttribute("id", "SleekCheckout");

  const config = {
    amount: options.amount,
    recipientAddress: options.recipientAddress,
    onError: options.onError,
    onSuccess: options.onSuccess,
    onClose: (...args: any[]) => {
      targetElement.remove();
      options.onClose && options.onClose(...args);
    },
  };

  const root = targetElement.attachShadow({ mode: "closed" });
  render(h(App, { ...config, root }), root);
}
