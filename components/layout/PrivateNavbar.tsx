"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useUserSession } from "@/hooks/useUserSession";
import { UserMenu } from "./components/UserMenu";
import { MobileMenu } from "./components/MobileMenu";

export default function PrivateNavbar() {
  const { user } = useUserSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Hydration protection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (userMenuOpen) setUserMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userMenuOpen]);

  const navLinkClass =
    "text-[#6D2323] font-medium hover:text-[#6D2323] hover:bg-[#6D2323]/10 px-3 py-2 rounded-md transition-all duration-200 text-sm lg:text-base whitespace-nowrap";
  const burgerLineClass =
    "block w-6 h-0.5 bg-[#6D2323] transition-all duration-300";

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isMounted && isScrolled
          ? "bg-[#FEF9E1]/90 backdrop-blur-lg shadow-md"
          : "bg-[#FEF9E1] shadow-sm"
      }`}
    >
      <div className="px-4 sm:px-6 md:px-12 lg:px-[66px] py-4 sm:py-5 md:py-6 lg:py-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" onClick={closeAllMenus}>
          <Image
            src="/images/logo.svg"
            alt="PanlasaLabs Logo"
            width={432}
            height={72}
            priority
            className="h-auto w-[200px] md:w-[250px] lg:w-[300px]"
          />
        </Link>

        {/* Mobile Menu Button */}
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

        {/* Desktop Navigation */}
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

          {/* User Menu */}
          <UserMenu
            user={user}
            isOpen={userMenuOpen}
            onToggle={() => setUserMenuOpen(!userMenuOpen)}
            onClose={() => setUserMenuOpen(false)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu user={user} isOpen={isMenuOpen} onClose={closeAllMenus} />
    </nav>
  );
}
