"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function PrivateNavbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass =
    "text-[#6D2323] font-medium hover:text-[#6D2323] hover:bg-[#6D2323]/10 px-3 py-2 rounded-md transition-all duration-200 text-sm lg:text-base whitespace-nowrap";
  const mobileNavLinkClass =
    "text-[#6D2323] font-medium hover:text-[#8B3030] transition-colors text-xl sm:text-2xl py-3 border-b border-[#6D2323]/20";
  const burgerLineClass =
    "block w-6 h-0.5 bg-[#6D2323] transition-all duration-300";

  const user = session?.user;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isMounted && isScrolled
          ? "bg-[#FEF9E1]/90 backdrop-blur-lg shadow-md"
          : "bg-[#FEF9E1] shadow-sm"
      }`}
    >
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
          <Link href="/recipe" className={navLinkClass}>
            Recipe
          </Link>
          <Link href="/contact" className={navLinkClass}>
            Contact Us
          </Link>

          <div className="flex items-center gap-3 ml-2 lg:ml-4 relative">
            {/* User display */}
            <button
              onClick={() => setUserMenuOpen((s) => !s)}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#6D2323]/10 transition-all duration-200"
              aria-haspopup="true"
            >
              {user?.image ? (
                // Use an img tag for arbitrary external avatars to avoid Image domain config
                <img
                  src={user.image}
                  alt={user.name ?? user.email ?? "User avatar"}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#6D2323] text-white flex items-center justify-center font-medium">
                  {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-[#1a1a1a] font-medium max-w-[120px] truncate">
                {user?.name ?? user?.email ?? "User"}
              </span>
            </button>

            {/* User dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-12 bg-white border border-[#eee] rounded shadow-md min-w-[160px] py-2 z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#FEF9E1]"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#FEF9E1]"
                >
                  Logout
                </button>
              </div>
            )}
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
              href="/recipe"
              onClick={() => setIsMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Recipe
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Contact Us
            </Link>

            <div className="flex flex-col gap-3 mt-6 sm:mt-8">
              <div className="flex items-center gap-3 px-4 py-3 border rounded bg-white">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name ?? "avatar"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#6D2323] text-white flex items-center justify-center font-medium">
                    {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-sm font-medium text-[#1a1a1a]">
                    {user?.name ?? user?.email ?? "User"}
                  </div>
                </div>
              </div>

              <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full bg-white text-[#6D2323] px-6 py-3 rounded border border-[#eee] font-medium text-base sm:text-lg">
                  Profile
                </button>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full bg-[#6D2323] text-white px-6 py-3 rounded font-medium text-base sm:text-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
