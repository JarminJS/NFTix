import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { configureChains, goerli } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { TbPlugConnectedX, TbPlugConnected } from "react-icons/tb";
import Link from "next/link";

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

  const { connect } = useConnect({
    chainId: 5,
    connector: new MetaMaskConnector({ chains }),
  });

  useEffect(() => {
    setHasMounted(true);
  });

  if (!hasMounted) return null;

  if (isConnected) {
    return (
      <div className="flex flex-row gap-4">
        {/* <Image src={ensAvatar} height={200} width={200} alt="ENS Avatar" /> */}
        <button className="btn nav-item-end ">
          <Link href={`/account/${address}`}>
            {address.slice(0, 6) + "..." + address.slice(-4)}
          </Link>
        </button>
        <button className="btn nav-item-end gap-2" onClick={disconnect}>
          <TbPlugConnectedX /> <div className="hidden md:flex">Disconnect</div>
        </button>
      </div>
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
