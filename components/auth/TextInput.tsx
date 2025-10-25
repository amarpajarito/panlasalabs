"use client";

import React from "react";

export default function TextInput({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  suffix,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[#1a1a1a] font-medium text-sm mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 border ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-[#6D2323] focus:ring-[#6D2323]"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-[#1a1a1a] text-sm placeholder:text-gray-400 ${
            suffix ? "pr-10" : ""
          }`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
