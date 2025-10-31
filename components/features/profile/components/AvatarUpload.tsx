"use client";

import { useState, useEffect } from "react";

interface AvatarUploadProps {
  currentAvatar: string | null | undefined;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function AvatarUpload({
  currentAvatar,
  onFileSelect,
  disabled = false,
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    onFileSelect(file);
  };

  const displayUrl = previewUrl || currentAvatar;

  return (
    <div className="flex items-center gap-6">
      {/* Avatar Display */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#FEF9E1] to-[#6D2323]/10 border-2 border-[#6D2323]/20 shadow-lg">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#6D2323]/40"
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
            </div>
          )}
        </div>
        {previewUrl && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Upload Input */}
      <div className="flex-1">
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
          Profile Picture
        </label>
        <div className="flex items-center gap-3">
          <label
            className={`px-4 py-2 bg-white border-2 border-[#6D2323] text-[#6D2323] rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer hover:bg-[#6D2323] hover:text-white ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Choose File
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />
          </label>
          {selectedFile && (
            <span className="text-sm text-[#454545] truncate max-w-xs">
              {selectedFile.name}
            </span>
          )}
        </div>
        <p className="text-xs text-[#454545] mt-2">
          JPG, PNG or WebP. Max size 5MB.
        </p>
      </div>
    </div>
  );
}
