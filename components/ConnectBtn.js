import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { configureChains, goerli } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { TbPlugConnectedX, TbPlugConnected } from "react-icons/tb";
import { BsPerson } from "react-icons/bs";
import Link from "next/link";
import { Alchemy, Network } from "alchemy-sdk";

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
  var bal = 0;

  const { connect } = useConnect({
    chainId: 5,
    connector: new MetaMaskConnector({ chains }),
  });

  const { data, isError, isLoading } = useBalance({
    address: address,
  });

  console.log(data);

  useEffect(() => {
    setHasMounted(true);
  });

  if (!hasMounted) return null;

  if (isConnected) {
    return (
      <>
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar bg-white"
          >
            <BsPerson className="text-violet-900" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 text-black"
          >
            <li className="text-left">
              <div className="hover:bg-white active:bg-white active:text-black">
                Balance: {data.formatted.slice(0, 5)} ETH <br />
              </div>
            </li>
            <li>
              <Link href={`/account/${address}`} className="flex gap-2">
                <BsPerson />
                Account
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
    <div className="text-lg">
      <button
        className="btn nav-item-end gap-2 w-full"
        onClick={() => connect()}
      >
        <TbPlugConnected />
        <div className="hidden md:flex">Connect</div>
      </button>

      {error && <div>{error.message}</div>}
    </div>
  );
}

export default ConnectBtn;
