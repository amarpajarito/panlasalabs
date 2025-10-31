import { AvatarIcon } from "./AvatarIcon";

export function LoadingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <AvatarIcon type="assistant" />
      <div className="bg-white border border-[#6D2323]/10 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex gap-2">
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#6D2323] rounded-full animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
