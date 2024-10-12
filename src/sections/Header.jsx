import { useState } from "react";
import { NAVIGATION_LINKS } from "../constants";
import MEDiator from "../assets/MED-iator.png";
import { Link, useLocation } from "react-router-dom";
import docScribe from "../assets/docScribeImg.jpg"

const Header = () => {
  const pathname = useLocation();

  return (
    <div className="bg-transparent">
      <nav className="fixed left-0 right-0 top-4 z-50">
        {/* Desktop Menu */}
        <div className="mx-auto hidden max-w-3xl items-center justify-center rounded-lg border border-slate-50/30 bg-black/20 py-3 backdrop-blur-lg lg:flex">
          <div className="flex items-center justify-between gap-2">
            {/* <div> */}
            <Link
              to="/"
              className="my-custom-font text-2xl tracking-wide text-white hover:text-blue-700 duration-300 ease-in-out"
            >
              DocScribe
            </Link>
            <Link to="/" className="hover:opacity-50 ease-in-out duration-300">
              <img
                className="rounded-full object-cover mx-auto h-12 w-12 border border-blue-700"
                src={docScribe}
                alt="DocScribe"
              />
            </Link>
          </div>
          {/* </div> */}
          <div className="ml-8">
            <ul className="lg:flex lg:items-center space-x-4">
              {NAVIGATION_LINKS.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className={`text-[1.05rem] font-normal tracking-tight text-white hover:text-blue-700 duration-300 ease-in-out ${
                      pathname.hash === index ? "text-blue-700" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
