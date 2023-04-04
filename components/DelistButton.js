import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { React, useState, useEffect } from "react";
import { useAccount, useContractRead, useConnect } from "wagmi";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import marketplaceAbi from "../contracts/abi/marketplace.json";

export function DelistButton({ listingid }) {
  const marketplaceAdd = "0x402a478f22da7d85006ab6ce9edff896a4905d00";

  const marketplaceConfig = {
    address: marketplaceAdd,
    abi: marketplaceAbi,
  };

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  });

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    ...marketplaceConfig,
    functionName: "delist",
    args: [listingid],
    gasLimit: 50000000000,
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      <div>
        {isLoading ? (
          <div className="btn-primary">Removing...</div>
        ) : (
          <div className="flex flex-col gap-4 ">
            <div className="btn-primary" onClick={() => write()}>
              Delist Ticket
            </div>
          </div>
        )}

        {/* {(isPrepareError ) && (
            <div>Error: {(prepareError)?.message}</div>
          )} */}
      </div>

      {isSuccess && (
        <div className="alert alert-success shadow-lg mt-2 text-white">
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
                Ticket Removed from Marketplace
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
        <div className="alert alert-error shadow-lg w-full mt-2">
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
