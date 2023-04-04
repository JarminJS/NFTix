import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Nav from "../../components/Nav";

export default function Account(data) {
  const router = useRouter();
  const { address } = router.query;
  const flag = ethers.utils.isAddress(address);
  var owned;
  if (flag) {
    owned = data?.data.ownedNfts;
  }
  // console.log(data.data);

  const jbga = 0x3978398d6485c07bf0f4a95ef8e4678b747e56b6;

  return (
    <>
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
                <div className="text-md">List of Tickets: </div>
              ) : (
                <></>
              )}
              <div className="w-full flex md:flex-row flex-col gap-6 flex-wrap pb-8">
                {owned.map((item) => (
                  // eslint-disable-next-line react/jsx-key
                  <Link
                    key={item.contract.address && item.tokenId}
                    href={
                      item.contract.address == jbga
                        ? `jbga/${item.tokenId}`
                        : ""
                    }
                    className="md:w-1/3 sm:w-1/2 w-full rounded-xl flex-1 md:flex-none text-black bg-transparent border-slate-200 border-2 shadow-md flex-col hover:border-blue-800 hover:scale-[1.01]"
                  >
                    <Image
                      src={
                        item.contract.address == jbga &&
                        "https://bafybeibnrasojyzexvr232dnuwyykw4v6mrjrcdn3sggjybfwcyenx7u34.ipfs.nftstorage.link/GA.png"
                      }
                      width={2000}
                      height={2000}
                      className="rounded-t-xl"
                      alt="Ticket Image"
                      priority
                    />
                    <div className="p-4 flex flex-col gap-2 text-sm">
                      <div className="font-bold">
                        {item.contract.address == jbga &&
                          "Justin Bieber Justice World Tour - Kuala Lumpur : General Admission"}
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
                  // eslint-disable-next-line react/jsx-key
                  // <>
                  //   <div>
                  //     {item.contract.address ==
                  //     0x3978398d6485c07bf0f4a95ef8e4678b747e56b6
                  //       ? "True"
                  //       : "False"}
                  //   </div>
                  //   {/* <div>{item.contract}</div> */}
                  // </>
                ))}
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
  var res;
  if (flag) {
    res = await fetch(`http://localhost:3000/api/account/${params.address}`);
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
