"use client";

interface ProfileFieldsProps {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  onNameChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  disabled?: boolean;
}

export function ProfileFields({
  name,
  firstName,
  lastName,
  email,
  onNameChange,
  onFirstNameChange,
  onLastNameChange,
  disabled = false,
}: ProfileFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Email (Read-only) */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          readOnly
          disabled
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#454545] cursor-not-allowed"
        />
        <p className="text-xs text-[#454545] mt-1">Email cannot be changed</p>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border-2 border-[#6D2323]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D2323]/20 focus:border-[#6D2323] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            disabled={disabled}
            placeholder="First name"
            className="w-full px-4 py-3 border-2 border-[#6D2323]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D2323]/20 focus:border-[#6D2323] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            disabled={disabled}
            placeholder="Last name"
            className="w-full px-4 py-3 border-2 border-[#6D2323]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D2323]/20 focus:border-[#6D2323] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
