/* eslint-disable react-hooks/rules-of-hooks */
import { React, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Nav from "../../../components/Nav";
import clientPromise from "../../../lib/mongodb";
import { useAccount } from "wagmi";
import ConnectButton from "../../../components/ConnectButton";

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const content = data.data[0];
  console.log();
  const tickets = content.ticket;
  const tnc = content.tnc;

  const rawdate = new Date(content.date);
  const date = `${rawdate.getDate()} ${
    month[rawdate.getMonth()]
  } ${rawdate.getFullYear()},  ${rawdate.toLocaleTimeString()}`;

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
                width={1000}
                height={1600}
                priority
              />
            </div>
            <div className="xl:w-1/2 w-full flex flex-col gap-6">
              <div className="text-2xl font-bold">{content.name}</div>
              <div className="rounded-md border-slate-200 border-2 shadow-md p-4">
                <div className="text-lg">Event Detail</div>

                <table className="w-full border-none">
                  <tr className="">
                    <td className="w-fit ">Venue: </td>
                    <td className>
                      <div className=" text-clip overflow-hidden">
                        {content.venue}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Date: </td>
                    <td>{date}</td>
                  </tr>
                </table>
              </div>
              <div className="w-full rounded-md text-black bg-transparent border-slate-200 border-2 shadow-md p-4">
                <table className="text-md w-full bg-transparent bg-opacity-0">
                  <thead>
                    <tr className="ticket text-left">
                      <th className="w-1/3">Ticket Type</th>
                      <th className="w-1/3">Price</th>
                      <th className="w-1/3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.type} className="ticket">
                        <td>{ticket.type}</td>
                        <td>{ticket.price} ETH</td>
                        <td>{ticket.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!isConnected && <ConnectButton />}
              {isConnected && (
                <Link href="/event/jb/mint">
                  <div className="w-full btn btn-primary">Buy Ticket</div>
                </Link>
              )}
              {/* Will change to a button -> redirect to ticket minting page */}
              {/* <div className="rounded-md border-slate-200 border-2 shadow-md p-4">
                <div className="text-lg mb-2">
                  Buy Ticket - Buy JBGA Ticket{" "}
                </div>
                <BuyPrimary
                  contract={"0x3978398d6485c07bf0f4a95ef8e4678b747e56b6"}
                />
              </div> */}
            </div>
          </div>
          <div className="flex flex-col px-4 md:px-0 gap-8 mb-8">
            <div className="w-full border-2 border-slate-200 shadow-md p-4 rounded-md">
              <div className="text-lg">Description</div>
              <div className="text-md">{content.description}</div>
            </div>
            <div className="w-full border-2 border-slate-200 shadow-md p-4 rounded-md">
              <div className="text-lg">Terms and Condition</div>
              <ol className="list-decimal list-outside pl-8">
                {tnc.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
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
