import { Recipe } from "./recipe";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

// Extended recipe with additional chat-specific fields
export interface ExtendedRecipe extends Recipe {
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  cuisine?: string;
  tags?: string[];
}
