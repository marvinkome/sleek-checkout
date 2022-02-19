import { h } from "preact";
import clx from "classnames";
import { IoIosCheckmarkCircle } from "@react-icons/all-files/io/IoIosCheckmarkCircle";

type SelectProps = {
  selected?: string;
  options?: ({ name: string | number; label: string; image: string; onSelect: (value: string | number) => void } | null)[];
};
export const Select = ({ selected, options }: SelectProps) => {
  return (
    <div>
      {options?.map((option) => (
        <div class="relative mb-3" key={option?.name}>
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
                "py-2",
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
                "ring-1": selected === option?.name,
                "ring-gray-500": selected === option?.name,
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

            {selected === option?.name && (
              <span class="ml-3 inset-y-0 absolute right-0 flex items-center pr-2">
                <IoIosCheckmarkCircle className="text-xl text-gray-800" />
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};
