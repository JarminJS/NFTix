import React, { useState, useEffect } from "react";
import { useContractRead, useAccount } from "wagmi";
import abi from "../contracts/abi/testabi.json";

function Stats({ contract }) {
  const { address, isConnected } = useAccount();
  const [supply, setSupply] = useState();
  const [ownAddress, setOwnAddress] = useState();
  const [left, setLeft] = useState();
  const gweiToEth = 1000000000000000000;
  // const ticketPrice = "0.08";

  const contractConfig = {
    address: contract,
    abi: abi,
  };

  const { data: currentToken } = useContractRead({
    ...contractConfig,
    functionName: "currentTokenId",
  });

  const { data: totalSupply } = useContractRead({
    ...contractConfig,
    functionName: "TOTAL_SUPPLY",
  });

  const { data: addressOwn } = useContractRead({
    ...contractConfig,
    functionName: "balanceOf",
    args: [address?.toString()],
  });

  const { data: symbol } = useContractRead({
    ...contractConfig,
    functionName: "symbol",
  });

  const { data: price } = useContractRead({
    ...contractConfig,
    functionName: "TICKET_PRICE",
  });

  const ticketPrice = price ? price.toString() / gweiToEth : 0.0;
  // console.log(inEth / gweiToEth);

  // setLeft(totalSupply - currentToken);

  useEffect(() => {
    if (currentToken) {
      let temp = currentToken;
      setSupply(temp);
      setLeft(totalSupply - temp);
    }

    if (addressOwn) {
      let temp = addressOwn;
      setOwnAddress(temp);
    }
  }, [currentToken, addressOwn, totalSupply]);

  return (
    <div className="w-full text-black rounded-md border-slate-200 border-2 p-4 shadow-md">
      <div className="font-bold text-lg">{symbol} Ticket Statistics </div>
      <table className="w-full border-none">
        <tbody>
          <tr>
            <td className="min-w-1/3 max-w-1/2">Total Supply:</td>
            <td>{totalSupply?.toString()}</td>
          </tr>
          {/* <tr>
            <td className="">Current Token ID:</td>
            <td>{supply?.toString()}</td>
          </tr> */}
          <tr>
            <td className="">Ticket Left:</td>
            <td>{left}</td>
          </tr>
          <tr>
            <td className="">Price:</td>
            <td>{ticketPrice?.toString()} ETH</td>
          </tr>
          {isConnected && (
            <tr>
              <td>Owned:</td>
              <td>
                {ownAddress ? ownAddress.toString() : 0} {symbol}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Stats;
