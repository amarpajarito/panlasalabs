"use client";

import { useSession } from "next-auth/react";
import PublicNavbar from "./PublicNavbar";
import PrivateNavbar from "./PrivateNavbar";
import { useEffect, useState } from "react";

export default function NavWrapper({ isAuthPage }: { isAuthPage: boolean }) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isAuthPage) return null;

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-[#FEF9E1] shadow-sm">
        <div className="px-4 sm:px-6 md:px-12 lg:px-[66px] py-4 sm:py-5 md:py-6 lg:py-8 flex items-center justify-between">
          <div className="h-12 w-[200px] md:w-[250px] lg:w-[300px] bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
        </div>
      </nav>
    );
  }

  // Show loading skeleton while checking session
  if (status === "loading") {
    return (
      <nav className="sticky top-0 z-50 bg-[#FEF9E1] shadow-sm">
        <div className="px-4 sm:px-6 md:px-12 lg:px-[66px] py-4 sm:py-5 md:py-6 lg:py-8 flex items-center justify-between">
          <div className="h-12 w-[200px] md:w-[250px] lg:w-[300px] bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
        </div>
      </nav>
    );
  }

  return session ? <PrivateNavbar /> : <PublicNavbar />;
}
