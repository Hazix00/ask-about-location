import { CityCoordinates } from "src/app/models/cityCoordinates.model";

export interface ClosestLocationsQuestionsDTO {
  from: number,
  size: number,
  coordinates: CityCoordinates
}
