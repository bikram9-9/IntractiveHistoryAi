import React from "react";
import Link from "next/link";

const NavBar = () => {
  return (
    <header className="py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link
            href="/"
            className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
          >
            GEO GAMES
          </Link>
          <nav>
            <ul className="flex space-x-6 text-gray-700">
              <li>
                <Link href="/" className="hover:text-gray-900 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-gray-900 hover:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/use"
                  className="hover:text-gray-900 hover:underline"
                >
                  Use
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
