"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  cuisine?: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export default function AIRecipeChat() {
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
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllInstructions, setShowAllInstructions] = useState(false);
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">(
    "ingredients"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recipePanelRef = useRef<HTMLDivElement>(null);
  // track the last high-level action so we can avoid conflicting auto-scrolls
  // (e.g., chat auto-scroll vs intentionally scrolling the recipe panel)
  const lastActionRef = useRef<string | null>(null);
  const [history, setHistory] = useState<
    { id: string; title: string; timestamp: string }[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);

  const PREVIEW_INGREDIENTS = 5;
  const PREVIEW_INSTRUCTIONS = 3;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollChatToTop = () => {
    try {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // fallback: scroll window to top of chat area
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      // ignore
    }
  };

  const scrollToRecipe = () => {
    // Try to bring the right-hand recipe panel into view. If it's not
    // rendered (small screens) fall back to scrolling to top of page.
    try {
      if (recipePanelRef.current) {
        // allow a small delay so the DOM has updated
        setTimeout(() => {
          recipePanelRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
          // clear the recipe action marker after the scroll finishes so
          // subsequent message updates will resume normal auto-scrolling
          setTimeout(() => {
            lastActionRef.current = null;
          }, 600);
        }, 60);
        return;
      }
      // fallback
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    // If the last action was showing a recipe, suppress automatic chat
    // scroll-to-bottom because we intentionally bring the recipe panel
    // into view instead.
    if (lastActionRef.current === "recipe") return;
    // If the last action was a user message but a recipe panel is open,
    // scroll the chat container to the top instead of auto-scrolling to
    // the bottom so the right-hand recipe panel remains visible.
    if (lastActionRef.current === "message" && currentRecipe) {
      scrollChatToTop();
      return;
    }
    scrollToBottom();
  }, [messages]);

  // Load last prompted recipe and local history from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("panlasa:prompted_history");
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      // ignore
    }

    try {
      const lastId = localStorage.getItem("panlasa:last_prompted_id");
      if (lastId) {
        // attempt to restore
        fetchAndNormalizeRecipe(lastId).then((mapped) => {
          if (mapped) {
            setCurrentRecipe(mapped);
            scrollToRecipe();
          }
        });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Listen for recipe creation events from PromptedRecipeSection
  useEffect(() => {
    const handleRecipeCreated = async (event: CustomEvent<any>) => {
      const recipeId = event.detail?.id;
      if (!recipeId) return;

      try {
        const mapped = await fetchAndNormalizeRecipe(String(recipeId));
        if (mapped) {
          // mark that we're showing a recipe so chat auto-scroll is suppressed
          lastActionRef.current = "recipe";
          setCurrentRecipe(mapped);
          setShowAllIngredients(false);
          setShowAllInstructions(false);
          setActiveTab("ingredients");
          // persist to local history when created externally
          try {
            saveHistoryEntry({
              id: String(recipeId),
              title: mapped.title || "Generated Recipe",
            });
          } catch (e) {
            /* ignore */
          }
          // bring recipe panel into view
          try {
            scrollToRecipe();
          } catch (e) {
            /* ignore */
          }
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };

    if (typeof window !== "undefined") {
      const listener = (e: Event) => handleRecipeCreated(e as CustomEvent<any>);
      window.addEventListener("prompted:created", listener);
      return () => window.removeEventListener("prompted:created", listener);
    }
    return () => {};
  }, []);

  // Helper: fetch recipe by id and normalize DB/API shape into our Recipe interface
  async function fetchAndNormalizeRecipe(id: string): Promise<Recipe | null> {
    try {
      const res = await fetch(`/api/recipes/${id}`);
      if (!res.ok) return null;
      const json = await res.json();
      const db = json?.recipe ?? json;

      // robustly parse arrays that may be stored as actual arrays or JSON-encoded strings
      const parseMaybeJsonArray = (val: any): string[] => {
        if (Array.isArray(val)) return val.map((v: any) => String(v));
        if (typeof val === "string") {
          const raw = val.trim();
          // try to parse if it's a JSON array encoded as a string
          if (/^[\[{]/.test(raw)) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) return parsed.map((v) => String(v));
            } catch (e) {
              // fallthrough to next strategies
            }
          }
          // fallback: split on newlines or commas
          const byNewline = raw
            .split(/\r?\n|\r/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (byNewline.length > 1) return byNewline;
          const byComma = raw
            .split(/,/) // sometimes stored as a comma-delimited string
            .map((s) => s.trim())
            .filter(Boolean);
          if (byComma.length > 1) return byComma;
          // single-line fallback
          return raw ? [raw] : [];
        }
        return [] as string[];
      };

      const normalizeScalar = (v: any) => {
        if (v === null || v === undefined) return "";
        let s = String(v).trim();
        // if something like 'json' or a raw object string, try parse
        if (s.toLowerCase() === "json" || /^[{[]/.test(s)) {
          try {
            const p = JSON.parse(s);
            if (p && typeof p === "object") {
              // prefer title/description fields if present
              if (p.title) return String(p.title).trim();
              if (p.name) return String(p.name).trim();
              // otherwise fallthrough to stringify
              return String(p).trim();
            }
          } catch (e) {
            // ignore
          }
        }
        // strip surrounding quotes and trailing commas that sometimes appear
        s = s
          .replace(/^['\"]+|['\"]+$/g, "")
          .replace(/[,]+$/g, "")
          .trim();
        return s;
      };

      const tags = Array.isArray(db.tags)
        ? db.tags.map((t: any) => normalizeScalar(t)).filter(Boolean)
        : typeof db.tags === "string"
        ? parseMaybeJsonArray(db.tags)
            .map((t: any) => normalizeScalar(t))
            .filter(Boolean)
        : [];

      const safeTitleRaw = db.title ?? db.name ?? "";
      const safeDescRaw = db.description ?? "";

      const parsedIngredients = parseMaybeJsonArray(db.ingredients).map(
        (i: any) =>
          // remove stray wrapping quotes and trailing commas
          String(i)
            .trim()
            .replace(/^['\"]+|['\"]+$/g, "")
            .replace(/[,]+$/g, "")
            .trim()
      );

      const parsedInstructions = parseMaybeJsonArray(db.instructions).map(
        (s: any) =>
          String(s)
            .trim()
            .replace(/^['\"]+|['\"]+$/g, "")
            .replace(/[,]+$/g, "")
            .trim()
      );

      // pretty-format numeric minute fields if present
      const formatMinutes = (v: any) => {
        if (v === null || v === undefined || v === "") return "";
        if (typeof v === "number") return `${v} mins`;
        const s = String(v).trim();
        if (/^\d+$/.test(s)) return `${s} mins`;
        return s;
      };

      const normalizeDifficultyFrontend = (val: any): string => {
        if (val === null || val === undefined) return "";
        const s = String(val).trim().toLowerCase();
        if (!s) return "";
        if (s.includes("easy") || s.includes("beginner")) return "Easy";
        if (
          s.includes("medium") ||
          s.includes("moderate") ||
          s.includes("intermediate")
        )
          return "Medium";
        if (
          s.includes("hard") ||
          s.includes("difficult") ||
          s.includes("advanced")
        )
          return "Hard";
        // fallback: title-case
        return String(s)
          .split(/\s+/)
          .map((w: string) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
          .join(" ")
          .trim();
      };

      const mapped: Recipe = {
        id: db.id ?? id,
        title: normalizeScalar(safeTitleRaw),
        description: normalizeScalar(safeDescRaw),
        prepTime: formatMinutes(db.prep_time ?? db.prepTime ?? ""),
        cookTime: formatMinutes(db.cook_time ?? db.cookTime ?? ""),
        servings: db.servings != null ? Number(db.servings) : 0,
        difficulty: normalizeDifficultyFrontend(db.difficulty ?? ""),
        cuisine: db.cuisine || undefined,
        ingredients: parsedIngredients,
        instructions: parsedInstructions,
        tags,
      };

      return mapped;
    } catch (err) {
      console.error("fetchAndNormalizeRecipe error:", err);
      return null;
    }
  }

  // History helpers (localStorage)
  function saveHistoryEntry(entry: { id: string; title: string }) {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("panlasa:prompted_history");
      const arr = raw ? (JSON.parse(raw) as any[]) : [];
      // dedupe by id
      const filtered = arr.filter((r) => r.id !== entry.id);
      const newArr = [
        {
          id: entry.id,
          title: entry.title,
          timestamp: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 20); // keep last 20
      localStorage.setItem("panlasa:prompted_history", JSON.stringify(newArr));
      localStorage.setItem("panlasa:last_prompted_id", entry.id);
      setHistory(newArr);
    } catch (e) {
      // ignore
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // mark this user action so chat auto-scroll behaves normally
    lastActionRef.current = "message";
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call YOUR ACTUAL API (not mock data!)
      const res = await fetch("/api/ai/prompted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("AI prompted error:", json);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Sorry, I couldn't generate a recipe just now. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
        return;
      }

      // Get the recipe ID from the response
      const recipeId = json?.id || json?.recipeId || null;
      const serverMessage =
        recipeId !== null
          ? "Your recipe has been generated and saved to your recipes."
          : json?.message ?? "Your recipe was generated.";

      // Fetch the full recipe details if we have an ID
      if (recipeId) {
        try {
          const mapped = await fetchAndNormalizeRecipe(String(recipeId));
          if (mapped) {
            // prefer showing the recipe panel instead of jumping chat scroll
            lastActionRef.current = "recipe";
            setCurrentRecipe(mapped);
            setShowAllIngredients(false);
            setShowAllInstructions(false);
            setActiveTab("ingredients");
            // persist to local history
            try {
              saveHistoryEntry({
                id: String(recipeId),
                title: mapped.title || "Generated Recipe",
              });
            } catch (e) {
              /* ignore */
            }
            // scroll recipe panel into view so the user sees the generated recipe
            try {
              scrollToRecipe();
            } catch (e) {
              /* ignore */
            }
          }
        } catch (err) {
          console.error("Error fetching recipe details:", err);
        }

        // Also fire the event for PromptedRecipeSection
        try {
          window.dispatchEvent(
            new CustomEvent("prompted:created", { detail: { id: recipeId } })
          );
        } catch (e) {
          // ignore
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: serverMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error calling AI API:", err);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, something went wrong while generating the recipe.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "I have chicken and vegetables",
    "Quick 30-minute dinner",
    "Filipino dessert recipe",
    "Vegetarian pasta dish",
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
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
        {/* Header - Fixed Design */}
        <div className="bg-white border-b border-[#6D2323]/10 px-4 sm:px-6 py-4 shadow-sm">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Left: Logo & Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6D2323] rounded-lg flex items-center justify-center shadow-sm">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-[#1a1a1a] font-bold text-lg">
                    AI Recipe Generator
                  </h1>
                  <p className="text-[#454545] text-xs">
                    Powered by Google Gemini
                  </p>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                {/* History Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowHistory((s) => !s)}
                    className="flex items-center gap-2 px-3 py-2 border border-[#6D2323]/20 rounded-lg hover:bg-[#FEF9E1] transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 text-[#6D2323]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="hidden sm:inline text-[#6D2323] font-medium text-sm">
                      History
                    </span>
                  </button>

                  {/* History Dropdown */}
                  {showHistory && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowHistory(false)}
                      />
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-80 bg-white border border-[#6D2323]/10 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#6D2323] to-[#8B3030] px-4 py-3">
                          <h3 className="text-white font-semibold text-sm">
                            Recent Recipes
                          </h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {history.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                              <svg
                                className="w-12 h-12 text-[#6D2323]/20 mx-auto mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p className="text-[#454545] text-sm">
                                No recent recipes yet
                              </p>
                              <p className="text-[#454545] text-xs mt-1">
                                Start generating to see your history
                              </p>
                            </div>
                          ) : (
                            <div className="divide-y divide-[#6D2323]/5">
                              {history.map((h) => (
                                <button
                                  key={h.id}
                                  onClick={async () => {
                                    const mapped =
                                      await fetchAndNormalizeRecipe(h.id);
                                    if (mapped) {
                                      // indicate we're showing a recipe so chat
                                      // auto-scroll is suppressed
                                      lastActionRef.current = "recipe";
                                      setCurrentRecipe(mapped);
                                      setActiveTab("ingredients");
                                      setShowHistory(false);
                                      try {
                                        scrollToRecipe();
                                      } catch (e) {
                                        /* ignore */
                                      }
                                    }
                                  }}
                                  className="w-full text-left p-4 hover:bg-[#FEF9E1]/50 transition-colors group"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[#6D2323] font-medium text-sm truncate group-hover:text-[#8B3030]">
                                        {h.title}
                                      </p>
                                      <p className="text-[#454545] text-xs mt-1">
                                        {new Date(
                                          h.timestamp
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                    <svg
                                      className="w-4 h-4 text-[#6D2323]/40 group-hover:text-[#6D2323] flex-shrink-0"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* New Chat Button */}
                <button
                  onClick={handleNewChat}
                  className="flex items-center gap-2 px-3 py-2 bg-[#6D2323] text-white rounded-lg hover:bg-[#8B3030] transition-colors duration-200 shadow-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="hidden sm:inline font-medium text-sm">
                    New Chat
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-[#FEF9E1]/20 px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-[#6D2323] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-[#6D2323] text-white"
                      : "bg-white border border-[#6D2323]/10 text-[#1a1a1a]"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-[#454545]"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 bg-[#FEF9E1] border border-[#6D2323]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-[#6D2323]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-[#6D2323] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="bg-white border border-[#6D2323]/10 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#6D2323] rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-[#6D2323] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#6D2323] rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-[#454545] text-sm mb-3 text-center font-medium">
                Quick prompts to get started:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-4 py-3 border border-[#6D2323]/20 rounded-lg hover:bg-[#FEF9E1] hover:border-[#6D2323]/30 hover:shadow-sm transition-all duration-200 text-[#454545] text-sm text-left group"
                  >
                    <span className="group-hover:text-[#6D2323] transition-colors">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-[#6D2323]/10 px-4 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                placeholder="Describe what you'd like to cook, or list your ingredients..."
                className="flex-1 px-4 py-3 border border-[#6D2323]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D2323]/20 focus:border-[#6D2323] transition-all duration-200"
                disabled={isLoading}
              />
              <button
                onClick={(e) => handleSubmit(e)}
                disabled={!input.trim() || isLoading}
                className="bg-[#6D2323] text-white px-6 py-3 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span className="hidden sm:inline font-medium">Send</span>
              </button>
            </div>
            <p className="text-[#454545] text-xs text-center mt-3">
              AI can make mistakes. Verify important recipe information.
            </p>
          </div>
        </div>
      </div>

      {/* Recipe Panel */}
      {currentRecipe && (
        <div className="hidden lg:flex lg:w-1/2 flex-col border-l border-[#6D2323]/10 bg-white">
          <div className="bg-gradient-to-b from-white to-[#FEF9E1]/20 px-6 py-6 border-b border-[#6D2323]/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-[#1a1a1a] font-bold text-2xl md:text-3xl mb-3">
                  {currentRecipe.title}
                </h2>
                <p className="text-[#454545] text-base leading-relaxed mb-4">
                  {currentRecipe.description}
                </p>
                {currentRecipe.cuisine && (
                  <div className="mb-3">
                    <span className="inline-block text-sm text-[#6D2323] bg-[#FEF9E1] px-3 py-1 rounded-md border border-[#6D2323]/10">
                      {currentRecipe.cuisine}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {currentRecipe.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#FEF9E1] text-[#6D2323] rounded-full text-sm font-medium border border-[#6D2323]/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setCurrentRecipe(null)}
                className="ml-4 p-2 hover:bg-[#FEF9E1] rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#6D2323]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#FEF9E1] rounded-lg p-4 border border-[#6D2323]/10">
                <div className="text-[#454545] text-sm mb-1">Prep Time</div>
                <div className="text-[#6D2323] font-bold">
                  {currentRecipe.prepTime}
                </div>
              </div>
              <div className="bg-[#FEF9E1] rounded-lg p-4 border border-[#6D2323]/10">
                <div className="text-[#454545] text-sm mb-1">Cook Time</div>
                <div className="text-[#6D2323] font-bold">
                  {currentRecipe.cookTime}
                </div>
              </div>
              <div className="bg-[#FEF9E1] rounded-lg p-4 border border-[#6D2323]/10">
                <div className="text-[#454545] text-sm mb-1">Servings</div>
                <div className="text-[#6D2323] font-bold">
                  {currentRecipe.servings}
                </div>
              </div>
              <div className="bg-[#FEF9E1] rounded-lg p-4 border border-[#6D2323]/10">
                <div className="text-[#454545] text-sm mb-1">Difficulty</div>
                <div className="text-[#6D2323] font-bold">
                  {currentRecipe.difficulty}
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("ingredients")}
                  className={`pb-3 font-semibold text-base transition-all relative ${
                    activeTab === "ingredients"
                      ? "text-[#6D2323]"
                      : "text-gray-500 hover:text-[#6D2323]"
                  }`}
                >
                  Ingredients
                  {activeTab === "ingredients" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D2323]"></span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("instructions")}
                  className={`pb-3 font-semibold text-base transition-all relative ${
                    activeTab === "instructions"
                      ? "text-[#6D2323]"
                      : "text-gray-500 hover:text-[#6D2323]"
                  }`}
                >
                  Instructions
                  {activeTab === "instructions" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D2323]"></span>
                  )}
                </button>
              </div>
            </div>

            {activeTab === "ingredients" && (
              <div className="space-y-4">
                <ul className="space-y-3">
                  {currentRecipe.ingredients
                    ?.slice(
                      0,
                      showAllIngredients
                        ? currentRecipe.ingredients.length
                        : PREVIEW_INGREDIENTS
                    )
                    .map((ingredient, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-[#454545] items-baseline"
                      >
                        <span className="text-[#6D2323] flex-shrink-0 text-lg leading-none">
                          •
                        </span>
                        <span className="text-base leading-relaxed">
                          {ingredient}
                        </span>
                      </li>
                    ))}
                </ul>

                {(currentRecipe.ingredients?.length || 0) >
                  PREVIEW_INGREDIENTS && (
                  <button
                    type="button"
                    onClick={() => setShowAllIngredients(!showAllIngredients)}
                    className="text-sm text-[#6D2323] font-semibold hover:text-[#8B3030] transition-colors flex items-center gap-1 mt-4"
                  >
                    {showAllIngredients ? (
                      <>
                        Hide ingredients
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Show all {currentRecipe.ingredients?.length} ingredients
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {activeTab === "instructions" && (
              <div className="space-y-4">
                <ol className="space-y-4">
                  {currentRecipe.instructions
                    ?.slice(
                      0,
                      showAllInstructions
                        ? currentRecipe.instructions.length
                        : PREVIEW_INSTRUCTIONS
                    )
                    .map((step, idx) => (
                      <li key={idx} className="flex gap-4 text-[#454545]">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6D2323] text-white text-sm font-semibold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-base leading-relaxed pt-0.5">
                          {step}
                        </span>
                      </li>
                    ))}
                </ol>

                {(currentRecipe.instructions?.length || 0) >
                  PREVIEW_INSTRUCTIONS && (
                  <button
                    type="button"
                    onClick={() => setShowAllInstructions(!showAllInstructions)}
                    className="text-sm text-[#6D2323] font-semibold hover:text-[#8B3030] transition-colors flex items-center gap-1 mt-4"
                  >
                    {showAllInstructions ? (
                      <>
                        Hide instructions
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Show all {currentRecipe.instructions?.length} steps
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
              <button className="flex-1 bg-[#6D2323] text-white px-6 py-3.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Save Recipe
              </button>
              <button className="flex-1 bg-white border-2 border-[#6D2323] text-[#6D2323] px-6 py-3.5 rounded-lg hover:bg-[#6D2323] hover:text-white transition-colors duration-200 font-semibold text-base flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
