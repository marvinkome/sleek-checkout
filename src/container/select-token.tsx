import { h } from "preact";
import { Select } from "../components/select";
import { useState } from "preact/hooks";
import { useRouter } from "../services/router";
import { useWeb3React } from "@web3-react/core";
import { ACCEPTED_TOKENS } from "../services/web3/constants";

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
    <div>
      <h4 class="block text-sm mb-3">Select token to continue</h4>

      <Select selected={selectedToken} options={options} />

      {error && <p class="text-sm mt-5 text-red-700">Please select a token</p>}

      <button class="btn" disabled={!selectedToken} onClick={() => onClick()}>
        Proceed
      </button>
    </div>
  );
}

export default SelectToken;
