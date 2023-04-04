import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function EventList(data) {
  const events = data.events;
  return (
    <div className="flex sm:flex-row flex-wrap flex-col px-4 md:px-0 items-start rounded-md flex-auto  w-full">
      {events.map((event) => (
        <div key={event.id} className="flex flex-col md:w-1/3 w-full">
          <div className="mx-2 my-3">
            <Link
              href={event.slug ? `event/${event.slug}` : "/"}
              className="w-full card flex flex-col shadow-md border-2 border-slate-300 justify-start gap-2 hover:scale-[1.01] hover:border-blue-900 pb-4"
            >
              <Image
                src={`/${event.slug}.jpeg`}
                alt={"Presentation"}
                className="rounded-t-lg w-full h-full shadow-md "
                width={960}
                height={600}
                priority
              />
              <div className="mx-4 sm:w-auto w-screen">
                <div className="badge badge-primary rounded-md badge-sm p-2">
                  <div>{event.tag}</div>
                </div>

                <div className="font-bold text-lg truncate ">{event.name}</div>
                <div>
                  <div className="subtitle">Location: </div>
                  <div className="truncate main">{event.venue}</div>
                </div>

                <div>
                  <div className="subtitle">Date: </div>
                  <div className="main">{event.date}</div>
                </div>

                <div>
                  <div className="subtitle">Price</div>
                  <div className="main">
                    Starts from {event.ticket[0].price} ETH
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
