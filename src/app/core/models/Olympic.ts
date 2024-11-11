import { Participation } from "../models";

export interface OlympicCountry {
  id: number;
  country: string;
  participations: Participation[];
}
