import { h } from "preact";
import { useRouter } from "../services/router";
import { ACCEPTED_TOKENS } from "../services/web3/constants";

function SelectToken({ selectedToken, setSelectedToken }: any) {
  const { goForward } = useRouter();

  const onSelect = (e: any) => {
    const value = e.target.value;
    if (!value) return;

    setSelectedToken(value);
  };

  return (
    <div>
      <p>Select token here</p>
      <br />

      <select onChange={onSelect}>
        <option value="0">Select token</option>
        {Object.keys(ACCEPTED_TOKENS).map((key, index) => (
          <option key={index} value={key}>
            {key.toUpperCase()}
          </option>
        ))}
      </select>

      <br />
      <br />

      <button disabled={!selectedToken} onClick={() => goForward()}>
        Proceed
      </button>
    </div>
  );
}

export default SelectToken;
