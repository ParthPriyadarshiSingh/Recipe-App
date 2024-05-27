export interface RecipeList {
  id: number;
  image: string;
  title: string;
}

export interface RecipeData {
  results: RecipeList[];
}

export interface Measure {
  amount: number;
  unit: string;
}

export interface ExtendedIngredient {
  aisle: string;
  amount: number;
  consistency: string;
  id: number;
  image: string;
  measures: { [key: string]: Measure };
  meta: string[];
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  unit: string;
}

export interface Recipe {
  aggregateLikes: number;
  analyzedInstructions: any[];
  cheap: boolean;
  cookingMinutes: number;
  creditsText: string;
  cuisines: any[];
  dairyFree: boolean;
  diets: any[];
  dishTypes: string[];
  extendedIngredients: ExtendedIngredient[];
  gaps: string;
  glutenFree: boolean;
  healthScore: number;
  id: number;
  image: string;
  imageType: string;
  instructions: string;
  license: string;
  lowFodmap: boolean;
  occasions: any[];
  originalId: any;
  preparationMinutes: number;
  pricePerServing: number;
  readyInMinutes: number;
  servings: number;
  sourceName: string;
  sourceUrl: string;
  spoonacularScore: number;
  spoonacularSourceUrl: string;
  summary: string;
  sustainable: boolean;
  taste: Taste;
  title: string;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  weightWatcherSmartPoints: number;
  winePairing: WinePairing;
}
interface Taste {
  bitterness: number;
  fattiness: number;
  saltiness: number;
  savoriness: number;
  sourness: number;
  spiciness: number;
  sweetness: number;
}

interface WinePairing {
  pairedWines: any[];
  pairingText: string;
  productMatches: any[];
}
