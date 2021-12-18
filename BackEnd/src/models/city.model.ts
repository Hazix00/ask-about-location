import { Schema, model } from 'mongoose';
import mongoosastic from 'mongoosastic';

// 1. Create an interface representing a document in MongoDB.

export interface City {
  id: string
  name: string
  coordinate : {lat: number, lon: number }
}

// 2. Create a Schema corresponding to the document interface.
// I use ./city.elasticsearch.index.json to create mapping manually
export const citySchema = new Schema({
  name: { type: String, es_type: 'search_as_you_type', es_indexed: true },
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

citySchema.plugin(mongoosastic, {
  index: 'cities',
  type: 'city'
})

// 3. Create a Model.
export const CityModel = model('City', citySchema);