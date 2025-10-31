interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({
  user,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-9 h-9 text-base",
    lg: "w-10 h-10 text-lg",
  };

  const displayName = user?.name || user?.email || "?";
  const initial = displayName.charAt(0).toUpperCase();

  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={displayName}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-[#6D2323] text-white flex items-center justify-center font-medium ${className}`}
    >
      {initial}
    </div>
  );
}
