"use client";

import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { uploadAvatar, createAvatarBucket } from "@/utils/storage/avatarUpload";
import { AvatarUpload } from "./components/AvatarUpload";
import { ProfileFields } from "./components/ProfileFields";
import { SaveButton } from "./components/SaveButton";
import { useRouter } from "next/navigation";

export default function ProfileForm() {
  const { user, loading, updateProfile } = useUserProfile();
  const router = useRouter();

  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [needsBucketCreation, setNeedsBucketCreation] = useState(false);
  const [creatingBucket, setCreatingBucket] = useState(false);

  // Initialize form fields
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
    }
  }, [user]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const hasChanges =
    name !== (user?.name ?? "") ||
    firstName !== (user?.first_name ?? "") ||
    lastName !== (user?.last_name ?? "") ||
    file !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    setNeedsBucketCreation(false);

    try {
      let avatarUrl: string | undefined;

      // Upload avatar if file selected
      if (file && user?.id) {
        const uploadResult = await uploadAvatar(file, user.id);

        if (!uploadResult.success) {
          if (uploadResult.needsBucketCreation) {
            setNeedsBucketCreation(true);
          }
          setError(uploadResult.error || "Failed to upload avatar");
          setSaving(false);
          return;
        }

        avatarUrl = uploadResult.url;
      }

      // Build update payload
      const payload: any = {
        name: name.trim() || undefined,
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
      };

      if (avatarUrl) {
        payload.avatar_url = avatarUrl;
      }

      // Update profile via API
      const result = await updateProfile(payload);

      if (!result.success) {
        setError(result.error || "Failed to update profile");
        return;
      }

      // Success - show message and redirect
      setSuccess(true);
      setFile(null);
      setError(null);

      // Wait for session update before redirecting
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message ?? "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel button - discard changes
  const handleCancel = () => {
    router.back();
  };

  const handleCreateBucket = async () => {
    setCreatingBucket(true);
    setError(null);

    const result = await createAvatarBucket();

    if (result.success) {
      setSuccess(true);
      setNeedsBucketCreation(false);
      setError(null);
    } else {
      setError(result.error || "Failed to create bucket");
    }

    setCreatingBucket(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-[#6D2323]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="ml-3 text-[#454545]">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-[#454545]">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
          Profile Settings
        </h1>
        <p className="text-[#454545]">
          Manage your account information and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border-2 border-[#6D2323]/10 p-6 shadow-sm">
          <AvatarUpload
            currentAvatar={user.avatar_url}
            onFileSelect={setFile}
            disabled={saving}
          />
        </div>

        <div className="bg-white rounded-xl border-2 border-[#6D2323]/10 p-6 shadow-sm">
          <ProfileFields
            name={name}
            firstName={firstName}
            lastName={lastName}
            email={user.email}
            onNameChange={setName}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            disabled={saving}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-green-800">
                Profile updated successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

        {needsBucketCreation && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-yellow-800 mb-3">
                  Storage bucket needs to be created before uploading images.
                </p>
                <button
                  type="button"
                  onClick={handleCreateBucket}
                  disabled={creatingBucket}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                >
                  {creatingBucket ? "Creating..." : "Create Storage Bucket"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="px-6 py-2.5 border-2 border-[#6D2323]/20 text-[#6D2323] rounded-lg hover:bg-[#6D2323]/5 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <SaveButton
            saving={saving}
            disabled={!hasChanges}
            hasChanges={hasChanges}
          />
        </div>
      </form>
    </div>
  );
}
