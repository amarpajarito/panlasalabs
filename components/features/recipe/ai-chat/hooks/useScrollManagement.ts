import { useRef, useEffect } from "react";
import { Message, ExtendedRecipe } from "@/types/chat";

export function useScrollManagement(
  messages: Message[],
  currentRecipe: ExtendedRecipe | null
) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recipePanelRef = useRef<HTMLDivElement>(null);
  const lastActionRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollChatToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToRecipe = () => {
    if (recipePanelRef.current) {
      setTimeout(() => {
        recipePanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        setTimeout(() => {
          lastActionRef.current = null;
        }, 600);
      }, 60);
    }
  };

  useEffect(() => {
    if (lastActionRef.current === "recipe") return;
    if (lastActionRef.current === "message" && currentRecipe) {
      scrollChatToTop();
      return;
    }
    scrollToBottom();
  }, [messages, currentRecipe]);

  return {
    messagesEndRef,
    messagesContainerRef,
    recipePanelRef,
    lastActionRef,
    scrollToRecipe,
  };
}
