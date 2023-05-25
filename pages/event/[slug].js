import { React, useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import Nav from "../../components/Nav";
import Link from "next/link";
import clientPromise from "../../lib/mongodb";

export async function getServerSideProps({ params }) {
  //   console.log(params.slug);

  try {
    const client = await clientPromise;
    const db = client.db("testing");
    const event = await db
      .collection("events")
      .find({ slug: params.slug })
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

export default function cas({ data }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [hasMounted, setHasMounted] = useState(false);
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

  const content = data[0];
  if (content == undefined)
    return (
      <>
        <Head>
          <title>Event Not Found</title>
        </Head>
        <div className="main-container">
          <Nav />
          <div className="flex flex-col w-screen h-[80vh] items-center justify-center text-lg">
            <div>Event Not Found</div>

            <Link href="/" className="underline">
              Click here to go to the homepage
            </Link>
          </div>
        </div>
      </>
    );

  const tickets = content.ticket;
  const tnc = content.tnc;

  const info = content.info;

  const rawdate = new Date(content.date);
  const date = `${rawdate.getDate()} ${
    month[rawdate.getMonth()]
  } ${rawdate.getFullYear()},  ${rawdate.toLocaleTimeString(
    navigator.language,
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;

  return (
    <>
      <Head>
        <title>{content.name}</title>
      </Head>
      <div className="main-container">
        <Nav />

        <div className=" flex flex-col md:w-2/3 mx-auto gap-6 mt-8 ">
          <div className="flex xl:flex-row flex-col px-4 md:px-0 items-start rounded-lg gap-8">
            <div className="w-full gap-6 flex flex-col">
              <Image
                src={`/${content.slug}.jpeg`}
                alt={"Presentation"}
                className="rounded-lg w-auto h-auto shadow-md"
                height={2000}
                width={2000}
              />
            </div>
            <div className="w-full flex flex-col gap-6">
              <div className="text-2xl font-bold">{content.name}</div>
              <div className="rounded-lg border-slate-200 border-2 shadow-md p-4 bg-slate-50">
                <table className="w-full border-none border-y-2 border-slate-200 text-md">
                  <th className="p-0" colSpan={2}>
                    <td className="text-left">Event Detail</td>
                  </th>
                  <tr className="align-top">
                    <td className="w-fit ">Venue: </td>
                    <td className>
                      <div className="text-clip overflow-hidden font-medium">
                        {content.venue}
                      </div>
                    </td>
                  </tr>
                  <tr className="align-top">
                    <td>Date: </td>
                    <td className="font-medium">{date}</td>
                  </tr>
                </table>
              </div>
              <div className="w-full rounded-lg text-black bg-slate-50 border-slate-200 border-2 shadow-md p-4">
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
            </div>
          </div>
          <div className="flex flex-col px-4 md:px-0 gap-8 mb-4">
            <div className="w-full border-2 bg-slate-50 border-slate-200 shadow-md p-4 rounded-lg">
              {content.description && (
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
              )}

              {info && (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Entitlement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="flex sm:flex-row flex-col gap-2">
                            {info.map((x) => (
                              <div
                                key={x.type}
                                className="flex flex-col sm:w-1/2 "
                              >
                                <div className="font-bold">{x.type}</div>
                                <ol className="list-decimal list-outside pl-4">
                                  {x.entitlement.map((i) => (
                                    <li key={i}>{i}</li>
                                  ))}
                                </ol>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {content.entitlement && (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Entitlement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="flex sm:flex-row flex-col gap-2">
                            <ol className="list-decimal list-outside pl-4">
                              {content.entitlement.map((i) => (
                                <li key={i}>{i}</li>
                              ))}
                            </ol>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {tnc && (
              <div className="w-full border-2 bg-slate-50 border-slate-200 shadow-md p-4 rounded-lg">
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// 1. Include Statistics
// 2. Include Image
// 3. Show ticket and direct card to ticket detail
