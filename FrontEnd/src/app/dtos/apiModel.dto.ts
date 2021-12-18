export interface ApiModelDTO<T> {
  _id: string,
  _index: string,
  _type: string,
  _score: number,
  _source: T
}
