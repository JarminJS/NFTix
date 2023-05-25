/* eslint-disable react-hooks/rules-of-hooks */
import { React, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Nav from "../../../components/Nav";
import clientPromise from "../../../lib/mongodb";
import { useAccount, useContractRead } from "wagmi";
import ConnectButton from "../../../components/ConnectButton";
import abi from "../../../contracts/abi/testabi.json";

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("testing");
    const event = await db
      .collection("events")
      .find({ slug: "jb" })
      .limit(1)
      .toArray();

    return {
      props: { data: JSON.parse(JSON.stringify(event)) },
    };
  } catch (e) {
    console.error(e);

    return {
      props: {
        client: false,
      },
    };
  }
}

export default function jb(data) {
  const [hasMounted, setHasMounted] = useState(false);
  const { isConnected } = useAccount();
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const content = data.data[0];
  console.log();
  const tickets = content.ticket;
  const tnc = content.tnc;

  const rawdate = new Date(content.date);
  const date = `${rawdate.getDate()} ${
    month[rawdate.getMonth()]
  } ${rawdate.getFullYear()},  ${rawdate.toLocaleTimeString()}`;

  const gaConfig = {
    address: "0x3978398d6485c07bf0f4a95ef8e4678b747e56b6",
    abi: abi,
  };

  let { data: gaToken } = useContractRead({
    ...gaConfig,
    functionName: "currentTokenId",
  });

  gaToken = parseInt(gaToken);

  const gaSupply = 20 - gaToken;

  const vipConfig = {
    address: "0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1",
    abi: abi,
  };

  var { data: vipToken } = useContractRead({
    ...vipConfig,
    functionName: "currentTokenId",
  });

  vipToken = parseInt(vipToken);

  const vipSupply = 20 - vipToken;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <>
      <Head>
        <title>{content.name}</title>
      </Head>
      <div className="main-container">
        <Nav />

        <div className=" flex flex-col md:w-2/3 mx-auto gap-6 mt-8 ">
          <div className="flex xl:flex-row flex-col px-4 md:px-0 items-start rounded-md gap-8">
            <div className="xl:w-1/2 w-full gap-6 flex flex-col">
              <Image
                src={`/${content.slug}.jpeg`}
                alt={"Presentation"}
                className="rounded-lg w-auto h-auto shadow-md "
                width={2000}
                height={2000}
                priority
              />
            </div>
            <div className="xl:w-1/2 w-full flex flex-col gap-6">
              <div className="text-2xl font-bold">{content.name}</div>

              <div className="rounded-md border-slate-200 border-2 shadow-md p-4 bg-neutral-50 ">
                <table className="w-full border-none border-y-2 border-slate-200 text-md">
                  <th className="p-0" colSpan={2}>
                    <td className="text-left">Event Detail</td>
                  </th>
                  <tr className="align-top">
                    <td className="w-fit ">Venue: </td>
                    <td className>
                      <div className="text-clip overflow-hidden">
                        {content.venue}
                      </div>
                    </td>
                  </tr>
                  <tr className="align-top">
                    <td>Date: </td>
                    <td>{date}</td>
                  </tr>
                </table>
              </div>
              <div className="w-full rounded-md text-black bg-neutral-50 border-slate-200 border-2 shadow-md p-4">
                <table className="text-md w-full bg-transparent bg-opacity-0">
                  <thead>
                    <tr className="ticket text-left">
                      <th className="w-1/2">Ticket Type</th>
                      <th className="w-1/2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.type} className="ticket">
                        <td>{ticket.type}</td>
                        <td>{ticket.price} ETH</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Link href="/event/jb/mint">
                <div className="w-full btn btn-primary">Buy Ticket</div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col px-4 md:px-0 gap-8 mb-8 ">
            <div className="w-full border-2 border-slate-200 shadow-md p-4 rounded-md bg-neutral-50">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{content.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-full border-2 border-slate-200 shadow-md p-4 rounded-md bg-neutral-50">
              <table>
                <thead>
                  <tr>
                    <th>Terms and Condition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <ol className="list-decimal list-outside pl-8">
                        {tnc.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 1. Include Statistics
// 2. Include Image
// 3. Show ticket and direct card to ticket detail
