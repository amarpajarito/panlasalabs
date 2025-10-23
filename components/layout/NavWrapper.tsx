"use client";

import { useSession } from "next-auth/react";
import PublicNavbar from "./PublicNavbar";
import PrivateNavbar from "./PrivateNavbar";

export default function NavWrapper({ isAuthPage }: { isAuthPage: boolean }) {
  if (isAuthPage) return null;

  const { data: session, status } = useSession();

  // While session is loading, show the public navbar as a safe fallback to avoid blank header.
  if (status === "loading") return <PublicNavbar />;

  return session ? <PrivateNavbar /> : <PublicNavbar />;
}
