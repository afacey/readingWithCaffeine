export interface CoffeeShopsState {
  all: CoffeeShop[];
  list: CoffeeShop[];
  map: string;
}

export type CoffeeShop = {
  id: string;
  displayString: string;
  name: string;
  slug: string;
  language: string;
  place: any;
}