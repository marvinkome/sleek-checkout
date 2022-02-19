import { h } from "preact";
import clx from "classnames";
import { IoCloseOutline } from "@react-icons/all-files/io5/IoCloseOutline";
import { useRouter } from "../services/router";
import { useConfig } from "../services/config";

export const Layout = ({ children, maxPages }: any) => {
  const { activeRouteId } = useRouter();
  const { onClose } = useConfig();

  return (
    <div class="flex items-center justify-center fixed top-0 left-0 w-full h-full z-[599998] bg-[#000000b3]">
      <div class="relative flex flex-col bg-white rounded-3xl p-8 w-[380px] h-auto mx-14">
        <header class="flex justify-between">
          <div>
            <h2 class="text-xl font-bold text-stone-800">Sleek Pay</h2>
            <p class="text-sm text-gray-700">The easiest way to pay with crypto</p>
          </div>

          <button
            class="bg-gray-100 w-7 h-7 p-1 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
            onClick={() => onClose!()}
          >
            <IoCloseOutline />
          </button>
        </header>

        <main class="flex-1 mb-auto flex flex-col justify-center py-5">{children}</main>

        <footer class="flex justify-center mt-4">
          {Array.from({ length: maxPages }, (_, i) => (
            <div
              key={i}
              class={clx("w-2 h-2 bg-black rounded-full ml-1 mr-1", {
                "opacity-20": i > (activeRouteId || 0),
                "opacity-100": i <= activeRouteId,
              })}
            />
          ))}
        </footer>
      </div>
    </div>
  );
};
