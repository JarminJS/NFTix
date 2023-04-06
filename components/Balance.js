import React, { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";

function Balance() {
  const [hasMounted, setHasMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [add, setAdd] = useState();

  useEffect(() => {
    setAdd(address);
  }, [address]);

  const { data } = useBalance({
    address: add,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="font-semibold">
      {data ? data.formatted.slice(0, 5) : 0.0} ETH
    </div>
  );
}
export default Balance;
