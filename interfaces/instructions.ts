export type Root = Root2[];

export interface Root2 {
  name: string;
  steps: Step[];
}

export interface Step {
  equipment: Equipment[];
  ingredients: Ingredient[];
  number: number;
  step: string;
  length?: Length;
}

export interface Equipment {
  id: number;
  image: string;
  name: string;
  temperature?: Temperature;
}

export interface Temperature {
  number: number;
  unit: string;
}

export interface Ingredient {
  id: number;
  image: string;
  name: string;
}

export interface Length {
  number: number;
  unit: string;
}
