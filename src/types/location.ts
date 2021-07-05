export interface Location {
  name: string;
  longitude: number;
  latitude: number;
  address?: string;
}

export interface Library extends Location {
  radius?: number
}