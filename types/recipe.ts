export interface Recipe {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  ingredients?: string[];
  instructions?: string[];
}

export type PublicRecipe = Required<
  Pick<Recipe, "id" | "title" | "description" | "image">
> & {
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  instructions: string[];
};
