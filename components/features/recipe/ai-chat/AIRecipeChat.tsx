"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Message, ExtendedRecipe, HistoryItem } from "@/types/chat";
import { useRecipeHistory } from "./hooks/useRecipeHistory";
import { useScrollManagement } from "./hooks/useScrollManagement";
import { useRecipeEvents } from "./hooks/useRecipeEvents";
import { fetchAndNormalizeRecipe } from "@/utils/recipe/recipeNormalizer";
import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { QuickPrompts } from "./components/QuickPrompts";
import { ChatInput } from "./components/ChatInput";
import { RecipePanel } from "./components/RecipePanel";

export default function AIRecipeChat() {
  const { data: session } = useSession();
  const userId = (session as any)?.user?.id ?? "anonymous";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! 👋 I'm your AI recipe assistant. Tell me what ingredients you have, or describe what you'd like to cook, and I'll create a personalized recipe for you!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<ExtendedRecipe | null>(
    null
  );
  const [showHistory, setShowHistory] = useState(false);

  const {
    history,
    saveHistoryEntry,
    loadHistory,
    fetchServerHistory,
    removeHistoryEntry,
    LAST_ID_KEY,
  } = useRecipeHistory(userId);

  const { messagesEndRef, recipePanelRef, lastActionRef, scrollToRecipe } =
    useScrollManagement(messages, currentRecipe);

  // Load history and last recipe on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    loadHistory(session).then(() => {
      const lastId = localStorage.getItem(LAST_ID_KEY);
      if (lastId) {
        fetchAndNormalizeRecipe(lastId)
          .then((mapped) => {
            if (mapped) {
              setCurrentRecipe(mapped);
              lastActionRef.current = "recipe";
              scrollToRecipe();
            }
          })
          .catch(() => localStorage.removeItem(LAST_ID_KEY));
      }
    });
  }, [userId]);

  // Handle external recipe creation events
  useRecipeEvents({
    onRecipeCreated: (recipe) => {
      lastActionRef.current = "recipe";
      setCurrentRecipe(recipe);
      saveHistoryEntry({ id: recipe.id!, title: recipe.title });
      scrollToRecipe();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    lastActionRef.current = "message";
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/prompted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const json = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "Sorry, I couldn't generate a recipe just now. Please try again.",
            timestamp: new Date(),
          },
        ]);
        return;
      }

      const recipeId = json?.id || json?.recipeId;
      const serverMessage = recipeId
        ? "Your recipe has been generated and saved to your recipes."
        : json?.message ?? "Your recipe was generated.";

      if (recipeId) {
        const mapped = await fetchAndNormalizeRecipe(String(recipeId));
        if (mapped) {
          lastActionRef.current = "recipe";
          setCurrentRecipe(mapped);
          saveHistoryEntry({ id: String(recipeId), title: mapped.title });

          if (userId !== "anonymous") {
            await fetchServerHistory();
          }

          scrollToRecipe();
        }

        window.dispatchEvent(
          new CustomEvent("prompted:created", { detail: { id: recipeId } })
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: serverMessage,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Error calling AI API:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, something went wrong while generating the recipe.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = async (historyItem: HistoryItem) => {
    try {
      const mapped = await fetchAndNormalizeRecipe(historyItem.id);
      if (mapped) {
        lastActionRef.current = "recipe";
        setCurrentRecipe(mapped);
        setShowHistory(false);
        scrollToRecipe();
      } else {
        if (userId !== "anonymous") {
          await fetchServerHistory();
        } else {
          removeHistoryEntry(historyItem.id);
        }
      }
    } catch (err) {
      if (userId !== "anonymous") {
        await fetchServerHistory();
      }
    }
  };

  const handleNewChat = () => {
    setMessages([messages[0]]);
    setCurrentRecipe(null);
  };

  return (
    <div className="flex h-screen max-h-screen bg-white">
      {/* Chat Section */}
      <div
        className={`flex flex-col transition-all duration-500 ${
          currentRecipe ? "w-full lg:w-1/2" : "w-full"
        }`}
      >
        <ChatHeader
          onNewChat={handleNewChat}
          history={history}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          onHistorySelect={handleHistorySelect}
        />
        <MessageList
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
        {messages.length === 1 && <QuickPrompts onSelect={setInput} />}
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>

      {/* Recipe Panel */}
      {currentRecipe && (
        <RecipePanel
          recipe={currentRecipe}
          onClose={() => setCurrentRecipe(null)}
          recipePanelRef={recipePanelRef}
        />
      )}
    </div>
  );
}
