import React from "react";
import Transaction from "../../components/Transactions";
import { ethers } from "ethers";

export default function Transactions({ data }) {
  return <Transaction transactions={data} />;
}

export async function getServerSideProps({ params }) {
  const flag = ethers.utils.isAddress(params.address);
  var res;
  if (flag) {
    res = await fetch(
      `https://nf-tix.vercel.app/api/transaction/${params.address}`
    );
    res = await res.json();
  } else {
    res = null;
  }

  if (!res) {
    return {
      props: {
        data: null,
      },
    };
  }

  return {
    props: {
      data: res,
    },
  };
}
