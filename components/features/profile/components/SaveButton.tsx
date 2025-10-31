"use client";

interface SaveButtonProps {
  saving: boolean;
  disabled?: boolean;
  hasChanges?: boolean;
}

export function SaveButton({
  saving,
  disabled = false,
  hasChanges = false,
}: SaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || saving || !hasChanges}
      className="w-full md:w-auto px-8 py-3.5 bg-[#6D2323] text-white rounded-lg font-semibold text-base hover:bg-[#8B3030] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
    >
      {saving ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
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
          Saving Changes...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
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
          Save Changes
        </>
      )}
    </button>
  );
}
