/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Network, Alchemy } from "alchemy-sdk";
import Nav from "../components/Nav";
import Link from "next/link";
import Image from "next/image";
import abi from "../contracts/abi/testabi.json";
import { useContractRead } from "wagmi";
import Moralis from "moralis";

export default function Authenticate() {
  const [ticket, setTicket] = useState(0);
  const [tokenId, setTokenId] = useState(1);
  const [response, setResponse] = useState();
  const [owner, setOwner] = useState();

  useEffect(() => {
    console.log(response);
  }, [response]);

  const contractConfig = {
    address: ticket.toString(),
    abi: abi,
  };

  const { data } = useContractRead({
    ...contractConfig,
    functionName: "ownerOf",
    args: [tokenId],
  });

  async function findNFT(ticket, tokenId) {
    const settings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      network: Network.ETH_GOERLI,
    };

    const alchemy = new Alchemy(settings);
    var reply;

    // Print NFT metadata returned in the response:
    try {
      reply = await alchemy.nft.getNftMetadata(ticket, tokenId);
    } catch (e) {
      reply = null;
    }

    if (reply && reply.tokenUri == null) {
      reply = null;
    }

    // console.log(reply);
    setOwner(data);
    setResponse(reply);
  }

  return (
    <>
      <Head>
        <title>Authenticate</title>
      </Head>
      <div className="main-container">
        <Nav />

        <div className=" md:w-2/3 md:mx-auto text-black mt-4 flex flex-col gap-3  mx-4">
          <div className="text-2xl font-bold">Authenticate</div>
          <form className="w-full flex flex-col sm:flex-row items-center form-control rounded-none mx-auto">
            <label className="sm:input-group w-full">
              <select
                className="select select-bordered w-full sm:w-1/3 rounded-b-none bg-white text-base"
                onChange={(e) => {
                  setTicket(e.target.value);
                }}
              >
                <option className="bg-white" selected disabled>
                  Choose Event
                </option>
                <option
                  className="bg-white"
                  value={"0x3978398d6485c07bf0f4a95ef8e4678b747e56b6"}
                >
                  JBGA
                </option>
                <option
                  className="bg-white"
                  value={"0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1"}
                >
                  JBVIP
                </option>
              </select>
              <input
                type="number"
                placeholder="Token ID"
                className="input w-full sm:w-1/2 border-1 border-slate-300 rounded-none"
                min={1}
                onChange={(e) => {
                  setTokenId(e.target.value);
                }}
              />
              <div
                className="btn text-white bg-gradient-to-r from-blue-800 to-indigo-900 sm:w-1/6 w-full rounded-t-none"
                onClick={() => findNFT(ticket, tokenId)}
              >
                Find Ticket
              </div>
            </label>
          </form>
          {response == null && (
            <>
              <div className="text-black mx-auto mt-4">No Ticket Found</div>
            </>
          )}

          {response != null && (
            <>
              <div className="md:w-1/4 w-full rounded-xl text-black bg-neutral-50 border-slate-200 border-2 shadow-md flex-1 flex-col mt-4 mx-auto mb-8">
                <Image
                  src={response.media[0].gateway}
                  width={2000}
                  height={2000}
                  className="rounded-t-xl"
                  alt="Ticket Image"
                  priority
                />
                <div className="p-4 flex flex-col gap-2 text-sm">
                  <div className="font-bold">{response.title}</div>
                  <div className="flex flex-row gap-4 truncate items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex-none"></div>
                    <Link
                      href={`account/${owner}`}
                      className="hover:underline truncate"
                    >
                      {owner ? (
                        owner.slice(0, 6) + "..." + owner.slice(-6)
                      ) : (
                        <>Loading...</>
                      )}
                    </Link>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>Token ID: </div>
                    <div>{parseInt(response.tokenId)}</div>
                  </div>
                  <Link
                    href={`${response.contract.address}/${response.tokenId}`}
                    className="hover:scale-[1.02]"
                  >
                    <div className="btn btn-primary w-full">View Ticket</div>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// export async function getServerSideProps() {
//   return null;
// }
