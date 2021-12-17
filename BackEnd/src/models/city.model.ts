import { Schema, model } from 'mongoose';
import mongoosastic from 'mongoosastic'

// 1. Create an interface representing a document in MongoDB.

export interface City {
  name: string
  coordinate : {lat: number, lon: number }
}

// 2. Create a Schema corresponding to the document interface.

export const citySchema = new Schema({
  name: { type: String, es_indexed: true },
  coordinate: {
    geo_point: {
      type: String,
      es_type: 'geo_point',
      es_lat_lon: true,
      es_indexed: true
    },
    lat: { type: Number },
    lon: { type: Number }
  }
})

citySchema.plugin(mongoosastic)

// 3. Create a Model.
export const CityModel = model('City', citySchema);