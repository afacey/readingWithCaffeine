import { Location } from "./location";

export type TransportationMode = "fastest" | "pedestrian" | "bicycle";

export type Direction = {
  session: string;
  location: Location;
  map: string;
  instructions: string[];
  mode: TransportationMode;
}