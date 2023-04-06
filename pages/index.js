import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Nav from "../components/Nav";
import Link from "next/link";
import { clientPromise } from "../lib/mongodb";
import EventList from "../components/EventList";

export async function getServerSideProps() {
  try {
    await clientPromise;
    const res = await fetch("https://nf-tix.vercel.app/api/event");
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
      <div className="main-container">
        <Nav />
        <div className="flex flex-col md:w-2/3 md:mx-auto gap-6">
          {/* Image Carousel */}
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
