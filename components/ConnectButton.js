import React, { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { configureChains, goerli } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";

const { chains } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY })]
);

function ConnectButton() {
  const [hasMounted, setHasMounted] = useState();
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    chainId: 5,
    connector: new MetaMaskConnector({ chains }),
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div
      className="w-full rounded-xl btn btn-primary border-none"
      onClick={connect}
    >
      {" "}
      Connect Account to Purchase Ticket{" "}
    </div>
  );
}

export default ConnectButton;
