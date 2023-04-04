/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import Nav from "../components/Nav";
import Link from "next/link";
import Image from "next/image";
import abi from "../contracts/abi/testabi.json";
import { useContractRead } from "wagmi";

export default function Authenticate() {
  const [ticket, setTicket] = useState(0);
  const [tokenId, setTokenId] = useState(0);
  const [response, setResponse] = useState();
  const [owner, setOwner] = useState();

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
    var reply, own;

    // Print NFT metadata returned in the response:
    try {
      reply = await alchemy.nft.getNftMetadata(ticket, tokenId);
    } catch (e) {
      reply = null;
    }

    if (reply.tokenUri == null) {
      reply = null;
    }

    // console.log(reply);
    setResponse(reply);
    setOwner(data);
  }

  return (
    <div className="flex flex-col bg-neutral-50 min-h-screen min-w-fit">
      <Nav />

      <div className=" md:w-2/3 md:mx-auto text-black mt-4 flex flex-col gap-3  mx-4">
        <div className="text-2xl font-bold">Authenticate</div>
        <form className="w-full flex flex-row items-center form-control rounded-none mx-auto">
          <label className="input-group w-full">
            <select
              className="select select-bordered w-1/3 bg-white text-base"
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
              className="input w-1/2"
              min={1}
              onChange={(e) => {
                setTokenId(e.target.value);
              }}
            />
            <div
              className="btn btn-primary w-1/6"
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
            <div className="md:w-1/3 w-full rounded-xl text-black bg-transparent border-slate-200 border-2 shadow-md flex-1 flex-col mt-4 mx-auto mb-8">
              <Image
                src={
                  response.contract.address ==
                    0x3978398d6485c07bf0f4a95ef8e4678b747e56b6 &&
                  "https://bafybeibnrasojyzexvr232dnuwyykw4v6mrjrcdn3sggjybfwcyenx7u34.ipfs.nftstorage.link/GA.png"
                }
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
                    {owner.slice(0, 8) + "..." + owner.slice(-8)}
                  </Link>
                </div>
                <div className="flex flex-row justify-between">
                  <div>Token ID: </div>
                  <div>{parseInt(response.tokenId)}</div>
                </div>
                <Link
                  href={
                    response.contract.address ==
                    0x3978398d6485c07bf0f4a95ef8e4678b747e56b6
                      ? `jbga/${response.tokenId}`
                      : ""
                  }
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
  );
}