import { h } from "preact";
import clx from "classnames";
import { IoCloseOutline } from "@react-icons/all-files/io5/IoCloseOutline";
import { IoMdLock } from "@react-icons/all-files/io/IoMdLock";
import { useRouter } from "../services/router";
import { useConfig } from "../services/config";
import { truncateAddress } from "../services/utils";

// @ts-ignore
import sleekLogo from "../assets/logo.svg";

export const Layout = ({ children, maxPages }: any) => {
  const { activeRouteId } = useRouter();
  const { onClose, amount, recipientAddress } = useConfig();

  return (
    <div class="flex items-center justify-center fixed top-0 left-0 w-full h-full z-[599998] bg-[#000000b3]">
      <div class="relative flex flex-col bg-white rounded-[12px] w-[344px] h-auto min-h-[556px] mx-14 overflow-hidden">
        <header class="flex justify-between bg-gray-100 px-6 pt-6 pb-8">
          <div>
            <h2 class="text-2xl font-bold text-stone-800 mb-3">${amount}</h2>
            <p class="text-sm text-gray-700">
              To:
              <span class="text-gray-600 bg-gray-200 py-1 px-3 ml-2 font-medium rounded-[50px]">
                {truncateAddress(recipientAddress || "", 4)}
              </span>
            </p>
          </div>

          <button
            class="bg-gray-200 w-7 h-7 p-1 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
            onClick={() => onClose!()}
          >
            <IoCloseOutline />
          </button>
        </header>

        {children}

        <footer class="mt-4 px-6 py-6 text-center">
          <div class="flex justify-center mb-4">
            {Array.from({ length: maxPages }, (_, i) => (
              <div
                key={i}
                class={clx("w-2 h-2 bg-black rounded-full ml-1 mr-1", {
                  "opacity-20": i > (activeRouteId || 0),
                  "opacity-100": i <= activeRouteId,
                })}
              />
            ))}
          </div>
          <p class="flex text-xs items-center justify-center">
            <IoMdLock className="inline text-sm mr-1" />
            Powered by <img class="ml-1 inline" src={sleekLogo} />
          </p>
        </footer>
      </div>
    </div>
  );
};
