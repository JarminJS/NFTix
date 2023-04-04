import React from "react";
import Link from "next/link";
import ConnectBtn from "./ConnectBtn";

function Nav() {
  return (
    <div className="navbar bg-gradient-to-r from-blue-800 to-indigo-900 text-neutral-50 shadow-xl">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 bg-gradient-to-r from-blue-800 to-indigo-900 rounded-box w-52 text-md shadow-lg"
          >
            <li>
              <Link className="nav-item" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="nav-item" href="/marketplace">
                Marketplace
              </Link>
            </li>
            <li>
              <Link className="nav-item" href="/events">
                Events
              </Link>
            </li>
            <li>
              <Link className="nav-item" href="/authenticate">
                Authenticate
              </Link>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl text-neutral-50">
          NFTix
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 flex flex-row gap-4">
          <li>
            <Link className="nav-item m" href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="nav-item" href="/marketplace">
              Marketplace
            </Link>
          </li>
          <li>
            <Link className="nav-item" href="/events">
              Events
            </Link>
          </li>
          <li>
            <Link className="nav-item" href="/authenticate">
              Authenticate
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ConnectBtn />
      </div>
    </div>
  );
}

export default Nav;
