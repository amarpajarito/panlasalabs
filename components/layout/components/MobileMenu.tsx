import Link from "next/link";
import { signOut } from "next-auth/react";
import { UserAvatar } from "./UserAvatar";

interface MobileMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ user, isOpen, onClose }: MobileMenuProps) {
  const displayName = user?.name || user?.email || "User";
  const mobileNavLinkClass =
    "text-[#6D2323] font-medium hover:text-[#8B3030] transition-colors text-xl sm:text-2xl py-3 border-b border-[#6D2323]/20";

  return (
    <div
      className={`md:hidden fixed inset-0 bg-[#FEF9E1] z-40 transition-transform duration-300 overflow-hidden ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full justify-center items-center px-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-md">
          {/* Navigation Links */}
          <Link href="/" onClick={onClose} className={mobileNavLinkClass}>
            Home
          </Link>
          <Link href="/about" onClick={onClose} className={mobileNavLinkClass}>
            About
          </Link>
          <Link href="/recipe" onClick={onClose} className={mobileNavLinkClass}>
            Recipe
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className={mobileNavLinkClass}
          >
            Contact Us
          </Link>

          {/* User Section */}
          <div className="flex flex-col gap-3 mt-6 sm:mt-8">
            {/* User Info Card */}
            <div className="flex items-center gap-3 px-4 py-3 border-2 border-[#6D2323]/20 rounded-lg bg-white shadow-sm">
              <UserAvatar user={user} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1a1a1a] truncate">
                  {displayName}
                </div>
                <div className="text-xs text-[#454545] truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <Link href="/profile" onClick={onClose}>
              <button className="w-full bg-white text-[#6D2323] px-6 py-3 rounded-lg border-2 border-[#6D2323] font-semibold text-base sm:text-lg hover:bg-[#6D2323] hover:text-white transition-all duration-200">
                Profile Settings
              </button>
            </Link>

            <button
              onClick={() => {
                onClose();
                signOut({ callbackUrl: "/" });
              }}
              className="w-full bg-[#6D2323] text-white px-6 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#8B3030] transition-all duration-200 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
