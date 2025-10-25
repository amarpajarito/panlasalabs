"use client";

import React from "react";

export default function AuthFormContainer({
  title,
  subtitle,
  topActions,
  children,
  bottom,
}: {
  title: string;
  subtitle?: string;
  topActions?: React.ReactNode;
  children: React.ReactNode;
  bottom?: React.ReactNode;
}) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[#1a1a1a] font-bold text-2xl mb-2">{title}</h2>
        {subtitle && <p className="text-[#454545] text-sm">{subtitle}</p>}
      </div>

      {/* Top actions (social buttons etc) */}
      {topActions}

      {/* Main content (form) */}
      {children}

      {/* Bottom area (links, terms) */}
      {bottom}
    </div>
  );
}
