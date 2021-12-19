import express from "express";
import { handleResponse, handleSearch } from '../common/helperFunctions'
import { getKeycloak } from '../config/keycloak-config'
import { CityModel } from "../models/city.model";

export const citiesController = express.Router();

// Use Authentication
const keycloak = getKeycloak()
citiesController.use(keycloak.protect())

// GET /cities?search=value[&match=true] containing or matching search query param if match=true param is set
citiesController.get('/', async (req, res) => {
    
    await handleResponse(res, async () => {
      
      let from = req.body.from ? req.body.from : 0
      let size = req.body.size ? req.body.size : 10

      const search = req.query.search
      const match = req.query.match

      if(!search) {
          return res.status(500).json({error: "the [search] query parameter is required"})
      }
      // search city contains
      let searchCriteria:any = {
        "multi_match": {
          "query": search,
          "type": "bool_prefix",
          "fields": [
            "name",
            "namefield._2gram",
            "name._3gram"
          ]
        }
      }
      if(match && match == 'true') {
          // search the exact city name
          searchCriteria = {
            "match_phrase_prefix": {
              "name": search
            }
          }
      }
      const searchQuery = {
        from,
        size,
        query: searchCriteria
      }
      handleSearch(res, CityModel, searchQuery)
  }) 
});