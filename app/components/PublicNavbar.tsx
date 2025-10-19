"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinkClass =
    "text-[#6D2323] font-medium hover:text-[#4A1818] transition-colors text-sm lg:text-base whitespace-nowrap";
  const mobileNavLinkClass =
    "text-[#6D2323] font-medium hover:text-[#4A1818] transition-colors text-xl sm:text-2xl py-3 border-b border-[#6D2323]/20";
  const burgerLineClass =
    "block w-6 h-0.5 bg-[#6D2323] transition-all duration-300";

  return (
    <nav className="bg-[#FEF9E1] shadow-sm">
      <div className="px-4 sm:px-6 md:px-12 lg:px-[66px] py-4 sm:py-5 md:py-6 lg:py-8 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.svg"
            alt="PanlasaLabs Logo"
            width={432}
            height={72}
            priority
            className="h-auto w-[200px] md:w-[250px] lg:w-[300px]"
          />
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 z-50"
          aria-label="Toggle menu"
        >
          <span
            className={`${burgerLineClass} ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`${burgerLineClass} ${isMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`${burgerLineClass} ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link href="/" className={navLinkClass}>
            Home
          </Link>
          <Link href="/about" className={navLinkClass}>
            About
          </Link>
          <Link href="/cuisines" className={navLinkClass}>
            Cuisines
          </Link>
          <Link href="/contact" className={navLinkClass}>
            Contact Us
          </Link>

          <div className="flex gap-2 lg:gap-4 ml-2 lg:ml-4">
            <Link href="/signup">
              <button className="bg-[#6D2323] text-white px-4 lg:px-6 py-2 rounded hover:bg-[#4A1818] transition-colors font-medium text-sm lg:text-base">
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className="border-2 border-[#6D2323] text-[#6D2323] px-4 lg:px-6 py-2 rounded hover:bg-[#6D2323] hover:text-white transition-colors font-medium text-sm lg:text-base">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-[#FEF9E1] z-40 transition-transform duration-300 overflow-hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-center items-center px-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-md">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              About
            </Link>
            <Link
              href="/cuisines"
              onClick={() => setIsMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Cuisines
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Contact Us
            </Link>

            <div className="flex flex-col gap-3 mt-6 sm:mt-8">
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full bg-[#6D2323] text-white px-6 py-3 sm:py-4 rounded hover:bg-[#4A1818] transition-colors font-medium text-base sm:text-lg">
                  Sign Up
                </button>
              </Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full border-2 border-[#6D2323] text-[#6D2323] px-6 py-3 sm:py-4 rounded hover:bg-[#6D2323] hover:text-white transition-colors font-medium text-base sm:text-lg">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
