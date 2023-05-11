/* eslint-disable react-hooks/rules-of-hooks */
import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { useAccount, useContractRead, useConnect } from "wagmi";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abi from "../contracts/abi/testabi.json";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { configureChains, goerli } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useRouter } from "next/router";

const { chains } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY })]
);

export function BuyPrimary({ contract, price }) {
  const router = useRouter();
  const [addressOwn, setAddressOwn] = useState();
  const { address, isConnected } = useAccount();
  const [hasMounted, setHasMounted] = useState();
  const [quantity, setQuantity] = useState(0);
  const gweiToEth = 1000000000000000000;
  var ticketPrice;
  let slug;

  // console.log(price);

  if (contract == "0x3978398d6485c07bf0f4a95ef8e4678b747e56b6") {
    slug = "jbga";
    ticketPrice = 0.05;
  } else if (contract == "0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1") {
    slug = "jbvip";
    ticketPrice = 0.1;
  }

  const contractConfig = {
    address: contract,
    abi: abi,
  };

  const { data: limitPerPerson } = useContractRead({
    ...contractConfig,
    functionName: "LIMIT_PER_PERSON",
  });

  const { data: symbol } = useContractRead({
    ...contractConfig,
    functionName: "symbol",
  });

  const { data: owned } = useContractRead({
    ...contractConfig,
    functionName: "balanceOf",
    args: [address?.toString()],
  });

  var left = limitPerPerson?.toString() - (owned ? owned?.toString() : 0);

  if (left < 0) left = 0;

  const options = [];

  let { data: totalSupply } = useContractRead({
    ...contractConfig,
    functionName: "TOTAL_SUPPLY",
  });

  let { data: currentToken } = useContractRead({
    ...contractConfig,
    functionName: "currentTokenId",
  });

  totalSupply = Number(totalSupply);
  currentToken = Number(currentToken);

  for (
    var amount = 0;
    amount <= left && amount <= totalSupply - currentToken;
    amount++
  ) {
    options.push({ value: amount });
  }

  let {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "buyPrimary",
    args: [address, quantity],
    overrides: {
      value: ethers.utils.parseEther(
        (ticketPrice * quantity).toFixed(2).toString()
      ),
    },
    gasLimit: 50000000000,
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  //

  const { connect } = useConnect({
    chainId: 5,
    connector: new MetaMaskConnector({ chains }),
  });

  if (isSuccess) {
    router.reload();
  }

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!isConnected) {
    return (
      <>
        <div
          className="w-full rounded-xl btn bg-slate-200 border-none hover:bg-slate-300 text-black"
          onClick={connect}
        >
          {" "}
          Not Connected{" "}
        </div>
      </>
    );
  }

  if (left === 0) {
    return (
      <div className="btn w-full rounded-xl text-black btn-disabled">
        Maximum Ticket Owned
      </div>
    );
  }

  return (
    <>
      <div>
        {isLoading ? (
          <div className="btn-primary w-full" onClick={() => write()}>
            Purchasing...
          </div>
        ) : (
          <div className="flex flex-col gap-4 ">
            <form className="w-full flex flex-row items-center justify-between form-control">
              <label className="input-group w-full">
                <span className="bg-inherit text-black border-slate-400 border-2 w-1/3">
                  Amount:
                </span>

                <select
                  className="select select-bordered border-2 w-2/3 bg-white text-base"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                >
                  {options.map((option) => {
                    return (
                      <option
                        className="bg-white"
                        key={option.value}
                        value={option.value}
                      >
                        {option.value}
                      </option>
                    );
                  })}
                </select>
              </label>
            </form>
            {isPrepareError || quantity == 0 ? (
              <>
                <div className="btn disabled">
                  Buy {quantity} {quantity > 1 ? "Tickets" : "Ticket"}{" "}
                  {(quantity * ticketPrice).toFixed(2)} ETH
                  {price ? (
                    <> ~ RM{(quantity * ticketPrice * price).toFixed(2)}</>
                  ) : (
                    <></>
                  )}
                </div>
                {isPrepareError && (
                  <div className="alert alert-error">
                    Error: {prepareError?.code}
                  </div>
                )}
              </>
            ) : (
              <div className="btn-primary " onClick={() => write()}>
                Buy {quantity} {quantity > 1 ? "Tickets" : "Ticket"}{" "}
                {(quantity * ticketPrice).toFixed(2)} ETH
                {price ? (
                  <> ~ RM{(quantity * ticketPrice * price).toFixed(2)}</>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {isSuccess && (
        <div className="alert alert-success shadow-lg mt-4 text-white">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              <div className="flex flex-col">
                Successfully minted your ticket!
                <div>
                  View Ticket:{" "}
                  <Link
                    href={`/${contract.toLowerCase()}/${currentToken + 1}`}
                    className="hover:underline font-bold"
                  >
                    Click Link
                  </Link>
                </div>
                <div>
                  Transaction Hash:{" "}
                  <Link
                    href={`https://goerli.etherscan.io/tx/${data?.hash}`}
                    className="hover:underline"
                  >
                    {data?.hash.toString().slice(0, 6) +
                      "..." +
                      data?.hash.toString().slice(-4)}
                  </Link>
                </div>
              </div>
            </span>
          </div>
        </div>
      )}
      {isError && (
        <div className="alert alert-error shadow-lg w-full mt-4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error: {error?.message}</span>
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps() {
  var data = await fetch("https://nf-tix.vercel.app/api/price");
  data = await data.json();

  // console.log(data);

  return data;
}

// if successful -> notification bottom left redirect to ticket // modal with both link to transaction hash and ticket
// if error -> notification bottom left short description
