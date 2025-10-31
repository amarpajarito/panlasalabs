import { useState } from "react";
import { HistoryItem } from "@/types/chat";

export function useRecipeHistory(userId: string) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const HISTORY_KEY = `panlasa:prompted_history:${userId}`;
  const LAST_ID_KEY = `panlasa:last_prompted_id:${userId}`;

  const fetchServerHistory = async () => {
    const res = await fetch("/api/users/history");
    if (!res.ok) throw new Error("Failed to fetch history");
    const json = await res.json();
    if (!json?.ok) throw new Error(json?.error || "No history");
    const mapped = (json.history || []).map((r: any) => ({
      id: r.id,
      title: r.title || "Generated Recipe",
      timestamp: r.created_at || new Date().toISOString(),
    }));
    setHistory(mapped);
    return mapped;
  };

  const saveHistoryEntry = (entry: { id: string; title: string }) => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const filtered = arr.filter((r: HistoryItem) => r.id !== entry.id);
      const newArr = [
        {
          id: entry.id,
          title: entry.title,
          timestamp: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newArr));
      localStorage.setItem(LAST_ID_KEY, entry.id);
      setHistory(newArr);
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const loadHistory = async (session: any) => {
    if (typeof window === "undefined") return;
    if (session?.user && userId !== "anonymous") {
      try {
        await fetchServerHistory();
      } catch (e) {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (raw) setHistory(JSON.parse(raw));
      }
    } else {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    }
  };

  const removeHistoryEntry = (id: string) => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const newArr = arr.filter((r: HistoryItem) => r.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newArr));
      setHistory(newArr);
    } catch (e) {
      console.error("Failed to remove history", e);
    }
  };

  return {
    history,
    setHistory,
    saveHistoryEntry,
    loadHistory,
    fetchServerHistory,
    removeHistoryEntry,
    LAST_ID_KEY,
    HISTORY_KEY,
  };
}

// ============================================
// FILE 5: components/features/recipe/ai-chat/hooks/useScrollManagement.ts
// ============================================
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
