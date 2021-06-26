import { Library } from "./library";

export interface Directions {
  session: string;
  location: CoffeeShopLocation;
  map: string;
  instructions: string[];
  mode: TransportationMode;
}

export interface CoffeeShopLocation {
  name: string;
  longitude: string;
  latitude: string;
  address: string;
}

export type TransportationMode = "fastest" | "pedestrian" | "bicycle";