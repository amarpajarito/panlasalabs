import Link from "next/link";
import { signOut } from "next-auth/react";
import { UserAvatar } from "./UserAvatar";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function UserMenu({ user, isOpen, onToggle, onClose }: UserMenuProps) {
  const displayName = user?.name || user?.email || "User";

  return (
    <div className="flex items-center gap-3 ml-2 lg:ml-4 relative">
      {/* User Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[#6D2323]/10 transition-all duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <UserAvatar user={user} size="md" className="-my-1" />
        <span className="text-sm lg:text-base text-[#1a1a1a] font-medium max-w-[120px] truncate">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 text-[#6D2323] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          {/* Menu */}
          <div className="absolute right-0 top-12 bg-white border border-[#6D2323]/10 rounded-lg shadow-xl min-w-[180px] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-[#6D2323]/10">
              <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                {displayName}
              </p>
              <p className="text-xs text-[#454545] truncate">{user?.email}</p>
            </div>

            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#FEF9E1] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile Settings
            </Link>

            <button
              onClick={() => {
                onClose();
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
