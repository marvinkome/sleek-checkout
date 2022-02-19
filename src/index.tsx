import { h, render } from "preact";
import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { App } from "./App";

// @ts-ignore
import style from "./index.css";

// main entry point - calls loader and render app into element
export default function SleekPay(options: any) {
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
      style.unuse();
      targetElement.remove();
      options.onClose && options.onClose(...args);
    },
  };

  const shadowRoot = targetElement.attachShadow({ mode: "closed" });

  // create a mini-dom pattern
  const html = document.createElement("html");
  const body = document.createElement("body");

  html.setAttribute("id", "shadow-html");
  body.setAttribute("id", "shadow-body");

  html.appendChild(body);

  const root = shadowRoot.appendChild(html);

  style.use({ target: html });
  render(h(App, { ...config, root }), body);
}
