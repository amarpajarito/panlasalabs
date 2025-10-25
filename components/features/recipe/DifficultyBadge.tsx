export default function DifficultyBadge({
  difficulty,
}: {
  difficulty?: "Easy" | "Medium" | "Hard";
}) {
  if (!difficulty) return null;

  const classes =
    difficulty === "Easy"
      ? "bg-green-100 text-green-700"
      : difficulty === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="absolute top-4 right-4">
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${classes}`}
      >
        {difficulty}
      </span>
    </div>
  );
}
