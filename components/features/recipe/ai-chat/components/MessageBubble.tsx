import { Message } from "@/types/chat";
import { AvatarIcon } from "./AvatarIcon";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <AvatarIcon type="assistant" />}

      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-[#6D2323] text-white"
            : "bg-white border border-[#6D2323]/10 text-[#1a1a1a]"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
          {message.content}
        </div>
        <div
          className={`text-xs mt-2 ${
            isUser ? "text-white/70" : "text-[#454545]"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {isUser && <AvatarIcon type="user" />}
    </div>
  );
}
