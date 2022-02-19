import { h } from "preact";
import { Select } from "../components/select";
import { useRouter } from "../services/router";
import { SUPPORTED_CHAINS } from "../services/web3/constants";

function SelectNetwork({ selectedNetwork, setSelectedNetwork }: any) {
  const { goForward } = useRouter();

  const onSelect = (value: string) => {
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
    <div>
      <h4 class="block text-sm mb-3">Select network to continue</h4>

      <Select selected={selectedNetwork} options={options} />
    </div>
  );
}

export default SelectNetwork;
