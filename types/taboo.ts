export type SeverityLevel = "Red" | "Yellow" | "Green";

export interface TabooItem {
  id: string;
  word: string;
  language: string;
  country: string;
  regions: string[];
  lat: number;
  lng: number;
  type: string;
  severity_level: SeverityLevel;
  literal_meaning: string;
  misunderstood_as: string;
  cultural_context: string;
}
