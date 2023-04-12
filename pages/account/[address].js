import { ethers } from "ethers";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Nav from "../../components/Nav";
import Transaction from "../../components/Transactions";

export default function Account(data) {
  const router = useRouter();
  const { address } = router.query;
  const flag = ethers.utils.isAddress(address);
  var owned, transactions;
  if (flag) {
    owned = data?.data.ownedNfts;
    transactions = data?.trans;
  }

  // console.log(transactions);
  // console.log(data.data);

  const jbga = 0x3978398d6485c07bf0f4a95ef8e4678b747e56b6;
  // const jbvip = ;

  return (
    <>
      <Head>
        <title>Account - {address}</title>
      </Head>
      <div className="flex flex-col bg-neutral-50 min-h-screen min-w-fit">
        <Nav />

        <div className=" md:w-2/3 md:mx-auto text-black mt-4 flex flex-col gap-6  mx-4">
          {flag ? (
            <>
              <div className="flex flex-row gap-4 items-center w-full truncate pb-2">
                <div className="w-20 h-20 rounded-full bg-slate-300 shadow-md"></div>
                <div className="flex flex-col">
                  <div className="font-bold">
                    {address.slice(0, 6) + "..." + address.slice(-6)}
                  </div>
                  <div>
                    No. of Ticket{data.data.totalCount > 1 ? "s" : ""}:{" "}
                    {data.data.totalCount}
                  </div>
                </div>
              </div>
              {data.data.totalCount > 1 ? (
                <div className="text-lg font-bold">List of Tickets: </div>
              ) : (
                <></>
              )}
              <div className="flex flex-row flex-wrap px-4 md:px-0 items-start rounded-md flex-auto w-full mb-6">
                {owned.map((item) => (
                  <div
                    key={item.contract.address && item.tokenId}
                    className="flex flex-col md:w-1/3 w-1/2 "
                  >
                    <div className="mx-1 my-2 sm:mx-2 sm:my-3 ">
                      <Link
                        href={`/${item.contract.address}/${item.tokenId}`}
                        className="card flex flex-col bg-slate-50 shadow-md border-2 border-slate-300 justify-start gap-2 hover:scale-[1.01] hover:border-blue-900"
                      >
                        <Image
                          src={`${item.media[0].gateway}`}
                          width={2000}
                          height={2000}
                          className="rounded-t-xl"
                          alt="Ticket Image"
                          priority
                        />
                        <div className="p-4 flex flex-col gap-2 text-sm">
                          <div className="font-bold line-clamp-2">
                            {item.title}
                          </div>
                          <div className="flex flex-row justify-between">
                            <div>Token ID: </div>
                            <div>{parseInt(item.tokenId)}</div>
                          </div>
                          <div className="flex flex-row justify-between truncate">
                            <div>Owner: </div>
                            <div>
                              {address.slice(0, 6) + "..." + address.slice(-6)}
                            </div>
                          </div>

                          <div className="btn btn-primary">View</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-screen sm:w-auto overflow-x-auto">
                <Transaction transactions={transactions} />
              </div>
            </>
          ) : (
            <div className="w-full h-[80vh] flex text-lg justify-center items-center">
              Invalid Account
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const flag = ethers.utils.isAddress(params.address);
  var res, trans;
  if (flag) {
    res = await fetch(
      `https://nf-tix.vercel.app/api/account/${params.address}`
    );
    res = await res.json();

    trans = await fetch(
      `https://nf-tix.vercel.app/api/transaction/${params.address}`
    );
    trans = await trans.json();
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
      trans: trans,
    },
  };
}
