/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { configureChains, goerli } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { TbPlugConnectedX, TbPlugConnected } from "react-icons/tb";
import { BsPerson } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import Link from "next/link";
import { Alchemy, Network } from "alchemy-sdk";
import Balance from "./Balance";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)

// Set up client

const { chains } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY })]
);

function ConnectBtn() {
  return <Profile />;
}

export function Profile() {
  const [hasMounted, setHasMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { error } = useConnect();
  const { disconnect } = useDisconnect();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { connect } = useConnect({
    chainId: 5,
    connector: new MetaMaskConnector({ chains }),
  });

  // Create function to handle connect
  // if window ethereum -> login
  // else -> download first

  if (!hasMounted) return null;

  if (isConnected) {
    return (
      <>
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn nav-item-end gap-2 w-full hover:text-white"
          >
            <BsPerson />
            <div className="hidden md:flex">Account</div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 text-black"
          >
            <li className="text-left cursor-none">
              <span className="hover:bg-white active:bg-white active:text-black text-sm">
                Balance:
                <Balance />
              </span>
            </li>
            <li>
              <Link href={`/account/${address}`} className="flex gap-2">
                <BsPerson />
                My Account
              </Link>
            </li>
            <div className="divider py-0 my-0"></div>
            <li>
              <div
                href={"/"}
                className="border-none text-black gap-2"
                onClick={disconnect}
              >
                <TbPlugConnectedX /> <div>Disconnect</div>
              </div>
            </li>
          </ul>
        </div>
      </>
    );
  }

  return (
    <div className="">
      {!window.ethereum ? (
        <>
          <label htmlFor="my-modal-3" className="btn rounded-full nav-item-end">
            <BiErrorCircle />
          </label>
          <input type="checkbox" id="my-modal-3" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative">
              <label
                htmlFor="my-modal-3"
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <h3 className="text-lg font-bold text-black">
                Metamask Not Detected!
              </h3>
              <p className="py-4 text-black flex flex-col gap-3">
                <div>
                  Please install the Metamask extension if you are using desktop
                  or download the Metamask application if you are using
                  smartphone.{" "}
                </div>
                <a
                  href="https://metamask.io/download/"
                  className="underline "
                  target="_blank"
                  rel="noReferrer"
                >
                  Download here
                </a>{" "}
              </p>
            </div>
          </div>
        </>
      ) : (
        <button
          className="btn nav-item-end gap-2 w-full"
          onClick={() => connect()}
        >
          <TbPlugConnected />
          <div className="hidden md:flex">Connect</div>
        </button>
      )}
      {error && <div>{error.message}</div>}
    </div>
  );
}

export default ConnectBtn;
