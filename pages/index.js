import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Nav from "../components/Nav";
import Link from "next/link";
import { clientPromise } from "../lib/mongodb";
import EventList from "../components/EventList";

export async function getServerSideProps(context) {
  try {
    await clientPromise;
    const res = await fetch("http://localhost:3000/api/event");
    const data = await res.json();

    // console.log(data);

    return {
      props: { isDbConnected: true, data: data },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isDbConnected: false },
    };
  }
}

export default function Home({ isDbConnected, data }) {
  const testContract = "0x010c84e9b271C1ABdeA845A2Ae9eD2C164c37352";
  const [hasMounted, setHasMounted] = useState(false);
  const expo = [];
  const concert = [];
  const run = [];
  const featured = [];
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

  for (let i = 0; i < data.length; i++) {
    // console.log(data[i].date);

    const rawdate = new Date(data[i].date);
    // console.log(rawdate);
    const d = rawdate.getDate();
    const m = month[rawdate.getMonth()];
    const y = rawdate.getFullYear();

    data[i].date = d + " " + m + " " + y;

    if (i < 3) {
      featured.push(data[i]);
    }

    if (data[i].tag == "expo") {
      expo.push(data[i]);
    } else if (data[i].tag == "concert") {
      concert.push(data[i]);
    } else if (data[i].tag == "run") {
      run.push(data[i]);
    }

    // console.log(featured, expo, concert, run);
  }

  if (!isDbConnected) {
    console.log("Not Connected!");
  }

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <>
      <Head>
        <title>NFTix</title>
      </Head>
      <div className="flex flex-col bg-neutral-50 min-h-screen min-w-fit pb-8">
        <Nav />
        <div className="flex flex-col md:w-2/3 md:mx-auto gap-6">
          <div className="carousel md:w-2/3  mx-auto">
            <div id="slide1" className="carousel-item relative w-full">
              <Image
                src={`/${data[0].slug}.jpeg`}
                alt="Cover Image"
                height={600}
                width={960}
                className="md:w-screen md:mt-6 md:rounded-2xl"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a
                  href="#slide4"
                  className="btn btn-circle bg-transparent border-none"
                >
                  ❮
                </a>
                <a
                  href="#slide2"
                  className="btn btn-circle bg-transparent border-none"
                >
                  ❯
                </a>
              </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
              <Image
                src={`/${data[2].slug}.jpeg`}
                alt="Cover Image"
                height={600}
                width={960}
                className="w-full md:mt-6 md:rounded-2xl"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a
                  href="#slide1"
                  className="btn btn-circle bg-transparent border-none"
                >
                  ❮
                </a>
                <a
                  href="#slide3"
                  className="btn btn-circle bg-transparent border-none"
                >
                  ❯
                </a>
              </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
              <Image
                src={`/${data[3].slug}.jpeg`}
                alt="Cover Image"
                height={600}
                width={960}
                className="w-full  md:mt-6 md:rounded-2xl"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a
                  href="#slide2"
                  className="btn btn-circle bg-transparent border-none"
                >
                  ❮
                </a>
                <a
                  href="#slide4"
                  className="btn btn-circle bg-transparent border-none"
                >
                  ❯
                </a>
              </div>
            </div>
            <div id="slide4" className="carousel-item relative w-full">
              <Image
                src={`/${data[7].slug}.jpeg`}
                alt="Cover Image"
                height={600}
                width={960}
                className="w-full md:mt-6 md:rounded-2xl"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a
                  href="#slide3"
                  className="btn btn-circle bg-transparent border-none"
                >
                  ❮
                </a>
                <a
                  href="#slide1"
                  className="btn btn-circle bg-transparent border-none"
                >
                  ❯
                </a>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row text-lg font-semibold px-4 md:px-0 justify-between items-center">
            <div>Featured Events : </div>
            <Link href="/events">
              <div className="btn btn-primary">View All Events</div>
            </Link>
          </div>
          <EventList events={featured.slice(0, 3)} />
          <div className="w-full text-lg font-semibold px-4 md:px-0 ">
            <div>Concerts: </div>
          </div>
          <EventList events={concert.slice(0, 3)} />
          <div className="w-full text-lg font-semibold px-4 md:px-0 ">
            <div>Running Events: </div>
          </div>
          <EventList events={run.slice(0, 3)} />
          <div className="w-full text-lg font-semibold px-4 md:px-0 ">
            <div>Exhibitions: </div>
          </div>
          <EventList events={expo.slice(0, 3)} />
        </div>
      </div>
    </>
  );
}

// to do : //
// 0. to add to events : //
// 0.1. image //
// 0.2. venue //
// 0.3. description //
// 0.4. terms and condition //
// 0.5. ticket amount //

// 1. list events : mapping - in card form (display name, image, date, time, venue, ticket price and ticket amount, description, terms and condition )
// -- find image link and insert data template for events //

// 1.1 Convert date to readable format //
// 1.2 Change card to contain image //
// 1.3 Change card to link to different minting page //
// 1.4 Minting Page //

// 2. minting form - one type of ticket -- Accordion / Collapse
{
  /* <div className="collapse">
  <input type="checkbox" /> 
  <div className="collapse-title text-xl font-medium">
  Click me to show/hide content
  </div>
  <div className="collapse-content"> 
  <p>hello</p>
  </div>
  </div> */
}
// 3. after working - add another - use another selection to choose ticket
{
  //   <ul className="steps">
  //    <li className="step step-primary">Register</li>
  //    <li className="step step-primary">Choose plan</li>
  //    <li className="step">Purchase</li>
  //    <li className="step">Receive Product</li>
  //   </ul>
}

// 4. direct each event to its own event details [...nftix.com/events/${id}]
//    display dummy data ( event name, date, venue, terms and conditions, descriptions, ticket pricing, image )

/// 5. Add carousel to home page
{
  /* <div className="carousel w-full">
  <div id="slide1" className="carousel-item relative w-full">
    <img src="/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide4" className="btn btn-circle">❮</a> 
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide2" className="carousel-item relative w-full">
    <img src="/images/stock/photo-1609621838510-5ad474b7d25d.jpg" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide1" className="btn btn-circle">❮</a> 
      <a href="#slide3" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide3" className="carousel-item relative w-full">
    <img src="/images/stock/photo-1414694762283-acccc27bca85.jpg" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide2" className="btn btn-circle">❮</a> 
      <a href="#slide4" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide4" className="carousel-item relative w-full">
    <img src="/images/stock/photo-1665553365602-b2fb8e5d1707.jpg" className="w-full" />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide3" className="btn btn-circle">❮</a> 
      <a href="#slide1" className="btn btn-circle">❯</a>
    </div>
  </div>
</div> */
}
