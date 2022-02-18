import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
const INSTANCE_NAME = "SleekCheckout";

function loader(window: Window, render: any) {
  // initiate global variable
  if (!window[INSTANCE_NAME]) {
    window[INSTANCE_NAME] = {};
  }

  window[INSTANCE_NAME] = (options: any) => {
    if (window[INSTANCE_NAME].isLoaded) return;

    // initialize functiions here
    options.debug && console.log(`Initiazlizing ${INSTANCE_NAME} with options: `, options);

    // verify amount
    if (isNaN(Number(options.amount)) || Number(options.amount) < 0) {
      throw new Error("Amount must be a positive number");
    }

    // verify recipient is a valid address
    if (!options.recipientAddress || !isAddress(options.recipientAddress) || options.recipientAddress === AddressZero) {
      throw new Error("Recipient must be a valid address");
    }

    const escapedOptions = {
      amount: options.amount,
      recipientAddress: options.recipientAddress,
      onClose: options.onClose,
      onError: options.onError,
      onSuccess: options.onSuccess,
    };

    const wrappingElement = window.document.body;
    const targetElement = wrappingElement.appendChild(window.document.createElement("section"));
    targetElement.setAttribute("id", INSTANCE_NAME);

    // destroy the currrent rendered element
    const destroy = () => {
      window[INSTANCE_NAME].isLoaded = false;
      targetElement.remove();
    };

    window[INSTANCE_NAME].isLoaded = true;
    render(targetElement, {
      ...escapedOptions,
      onClose: () => {
        escapedOptions.onClose && escapedOptions.onClose();
        destroy();
      },
    });
  };
}

export default loader;
