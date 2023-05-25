import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function EventList(data) {
  const events = data.events;
  return (
    <div className="flex flex-row flex-wrap px-4 md:px-0 items-start rounded-md flex-auto  w-full">
      {events.map((event) => (
        <div key={event.id} className="flex flex-col md:w-1/3 w-1/2 ">
          <div className="mx-1 my-2 sm:mx-2 sm:my-3 ">
            <Link
              href={event.slug ? `event/${event.slug}` : "/"}
              className="card flex flex-col bg-slate-50 shadow-md border-2 border-slate-300 justify-start gap-2 hover:scale-[1.01] hover:border-blue-900 pb-4"
            >
              <Image
                src={`/${event.slug}.jpeg`}
                alt={"Presentation"}
                className="rounded-t-xl w-full h-full shadow-md layer"
                width={960}
                height={600}
                priority
              />
              <div className="mx-2 sm:mx-3 mt-2 sm:w-10/12 min-w-0 flex flex-col gap-y-2 ">
                <div className="badge badge-primary rounded-md badge-sm px-2 py-0 my-auto ">
                  {event.tag}
                </div>

                <div className="font-bold text-lg line-clamp-1">
                  {event.name}
                </div>

                <div>
                  <div className="subtitle">Location: </div>
                  <div className="main">{event.venue}</div>
                </div>

                <div>
                  <div className="subtitle">Date: </div>
                  <div className="main">{event.date}</div>
                </div>

                <div>
                  <div className="subtitle">Price</div>
                  <div className="main">From {event.ticket[0].price} ETH</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
