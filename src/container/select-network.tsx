import { h } from "preact";
import clx from "classnames";
import { useRouter } from "../services/router";
import { SUPPORTED_CHAINS } from "../services/web3/constants";

function SelectNetwork({ selectedNetwork, setSelectedNetwork }: any) {
  const { goForward } = useRouter();

  const onSelect = (value: number) => {
    if (!value) return;
    setSelectedNetwork(value);
    goForward();
  };

  const options = SUPPORTED_CHAINS.map((chain) => {
    return {
      name: chain?.chainId || 0,
      label: chain?.name || "",
      image: chain?.logo || "",
      onSelect,
    };
  });

  return (
    <main class="mb-auto flex flex-col justify-center py-6 px-6">
      <h4 class="block mb-5 text-center font-medium">Choose network to continue</h4>

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
                  "py-4",
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
                  "ring-1": selectedNetwork === option?.name,
                  "ring-gray-500": selectedNetwork === option?.name,
                }
              )}
              aria-haspopup="listbox"
              aria-expanded="true"
              aria-labelledby="listbox-label"
              onClick={() => option?.onSelect(option?.name)}
            >
              <span class="flex items-center">
                <img src={option?.image} alt={option?.label} className="flex-shrink-0 h-6 w-6 rounded-full" />
                <span className="ml-3 block truncate">{option?.label}</span>
              </span>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default SelectNetwork;
