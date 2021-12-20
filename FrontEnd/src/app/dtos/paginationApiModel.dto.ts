import { ApiModelDTO } from "./apiModel.dto";

export interface PaginationApiModelDTO<T> {
  total: number,
  max_score: number,
  hits: ApiModelDTO<T>[]
}
