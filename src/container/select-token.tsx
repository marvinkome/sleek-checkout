import { h } from "preact";
import clx from "classnames";
import { useState } from "preact/hooks";
import { useRouter } from "../services/router";
import { useWeb3React } from "@web3-react/core";
import { ACCEPTED_TOKENS } from "../services/web3/constants";
import { IoIosCheckmarkCircle } from "@react-icons/all-files/io/IoIosCheckmarkCircle";

function SelectToken({ selectedToken, setSelectedToken }: any) {
  const [error, setError] = useState(false);
  const { goForward } = useRouter();
  const { chainId } = useWeb3React();

  const onSelect = (value: string) => {
    if (!value) return;

    setSelectedToken(value);
  };

  const onClick = () => {
    if (!selectedToken) {
      setError(true);
    } else {
      goForward();
    }
  };

  const options = Object.keys(ACCEPTED_TOKENS).map((key) => {
    const token = ACCEPTED_TOKENS[key](chainId);

    return {
      name: key,
      label: key.toUpperCase(),
      image: token?.icon,
      onSelect,
    };
  });

  return (
    <main class="mb-auto flex flex-col justify-center py-6 px-6">
      <h4 class="block mb-5 text-center font-medium">Select token to send</h4>

      <div>
        {options?.map((option) => (
          <div class="relative mb-4" key={option?.name}>
            <button
              type="button"
              class={clx(
                [
                  "relative",
                  "w-full",
                  "bg-white",
                  "border",
                  "border-gray-300",
                  "rounded-md",
                  "shadow-sm",
                  "pl-3",
                  "pr-10",
                  "py-3",
                  "text-left",
                  "cursor-pointer",
                  "focus:outline-none",
                  "focus:ring-1",
                  "focus:ring-gray-500",
                  "focus:border-gray-500",
                  "hover:border-gray-500",
                  "sm:text-sm",
                ],
                {
                  "ring-1": selectedToken === option?.name,
                  "ring-gray-500": selectedToken === option?.name,
                }
              )}
              aria-haspopup="listbox"
              aria-expanded="true"
              aria-labelledby="listbox-label"
              onClick={() => option?.onSelect(option?.name)}
            >
              <span class="flex items-center">
                <img src={option?.image} alt={option?.label} className="flex-shrink-0 h-6 w-6 rounded-full" />
                <span className="ml-3 block truncate font-semibold">{option?.label}</span>
              </span>

              {selectedToken === option?.name && (
                <span class="ml-3 inset-y-0 absolute right-0 flex items-center pr-2">
                  <IoIosCheckmarkCircle className="text-xl text-gray-800" />
                </span>
              )}
            </button>
          </div>
        ))}
      </div>

      {error && <p class="text-sm mt-5 text-red-700">Please select a token</p>}

      <button class="btn" disabled={!selectedToken} onClick={() => onClick()}>
        Proceed
      </button>
    </main>
  );
}

export default SelectToken;
