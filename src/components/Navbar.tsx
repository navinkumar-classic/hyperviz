"use client"; 

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="text-black pr-32 pl-9 py-6 border-b-2 border-b-[#D5D7DA]">
      <div className="container mx-auto flex text-xl justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold flex items-center justify-center">
          <Image src={"/lightning-icon.svg"} width={25} height={25} alt="logo"/>
          <div className="mx-4">HyperViz</div>
        </Link>

        {/* Navigation Links */}
        <div className="space-x-5 flex items-center">
          <Link href="/" className="hover:text-gray-400">
            Home
          </Link>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-gray-400 focus:outline-none"
            >
              Model ▼
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 text-lg bg-white text-black shadow-lg rounded-lg overflow-hidden">
                <Link href="/knn" className="block px-4 py-2 hover:bg-gray-200">
                  KNN
                </Link>
                <Link href="/linear-regression" className="block px-4 py-2 hover:bg-gray-200">
                  Linear Regression
                </Link>
              </div>
            )}
          </div>

          <Link href="/about" className="hover:text-gray-400">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
