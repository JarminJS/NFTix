import clientPromise from "../lib/mongodb";
import Head from "next/head";
import Nav from "../components/Nav";
import EventList from "../components/EventList";

export default function Events({ events }) {
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

  for (let i = 0; i < events.length; i++) {
    // console.log(data[i].date);

    const rawdate = new Date(events[i].date);
    // console.log(rawdate);
    const d = rawdate.getDate();
    const m = month[rawdate.getMonth()];
    const y = rawdate.getFullYear();

    events[i].date = d + " " + m + " " + y;

    // console.log(featured, expo, concert, run);
  }

  return (
    <>
      <Head>
        <title>Events | NFTix</title>
      </Head>
      <div className="flex flex-col bg-neutral-50 min-h-screen min-w-fit pb-8">
        <Nav />
        <div className="flex flex-col md:w-2/3 md:mx-auto gap-6 mt-4 ">
          <div className="w-full text-lg font-semibold px-4 md:px-0 ">
            <div className="text-2xl font-bold">Events</div>
          </div>
          <EventList events={events} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("testing");

    const events = await db.collection("events").find({}).limit(50).toArray();

    return {
      props: { events: JSON.parse(JSON.stringify(events)) },
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
