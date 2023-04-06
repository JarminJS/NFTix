import React, { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";

function Balance() {
  const [hasMounted, setHasMounted] = useState(false);
  const { address } = useAccount();

  const { data } = useBalance({
    address: address,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return <div className="font-semibold">{data?.formatted.slice(0, 5)} ETH</div>;
}
export default Balance;
