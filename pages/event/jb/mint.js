import Image from "next/image";
import React, { useEffect, useState } from "react";
import Nav from "../../../components/Nav";
import clientPromise from "../../../lib/mongodb";
import { BuyPrimary } from "../../../components/BuyPrimaryButton";
import Stats from "../../../components/Stats";

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

export default function Mint(data) {
  const [ticketType, setTicketType] = useState(1);
  const [hasMounted, setHasMounted] = useState(0);
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

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    console.log(ticketType);
  }, [ticketType]);

  if (!hasMounted) return null;

  const content = data.data[0];
  const rawdate = new Date(content.date);
  const date = `${rawdate.getDate()} ${
    month[rawdate.getMonth()]
  } ${rawdate.getFullYear()}`;

  console.log(content);

  return (
    <>
      <div className="font-sans bg-slate-50 min-h-screen min-w-screen text-black">
        <Nav />

        <div className="flex flex-col md:w-2/3 mx-auto gap-6 my-8 ">
          <div className="flex lg:flex-row flex-col px-4 lg:px-0 items-start rounded-md gap-8">
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
              <div className="w-full rounded-md text-black bg-transparent border-slate-200 border-2 shadow-md p-4">
                <div className="font-bold">Event Details</div>
                <table className="w-full border-none">
                  <tbody>
                    <tr>
                      <td className="w-fit ">Venue: </td>
                      <td>
                        <div className=" text-clip overflow-hidden">
                          {content.venue}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Date: </td>
                      <td>{date}</td>
                    </tr>
                    <tr>
                      <td>Time: </td>
                      <td>{rawdate.toLocaleTimeString()}</td>
                    </tr>
                    <tr>
                      <td>Price: </td>
                      <td>Starts from {content.ticket[0].price} ETH</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:px-0">
            <div className="gap-6 flex md:flex-row flex-col mx-auto">
              <Stats contract={"0x3978398d6485c07bf0f4a95ef8e4678b747e56b6"} />
              <Stats contract={"0x52cf0f17db253195d1deda70b31c1485b6ee28b1"} />
            </div>
          </div>
          <div className="w-full px-4 lg:px-0">
            <div className="gap-6 flex flex-col mx-auto">
              <div className="w-full rounded-lg border-slate-200 border-2 shadow-md p-4">
                <div className="text-lg mb-2">General Admission Ticket</div>
                <BuyPrimary
                  contract={"0x3978398d6485c07bf0f4a95ef8e4678b747e56b6"}
                />
              </div>
              <div className="w-full rounded-lg border-slate-200 border-2 shadow-md p-4">
                <div className="text-lg mb-2">VIP Experience Ticket</div>
                <BuyPrimary
                  contract={"0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
