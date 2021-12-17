import express from "express";
import { handleSearch } from "../common/handle-elastic-response";
import { handleResponse } from "../common/handle-response";
import { getKeycloak } from '../config/keycloak-config'
import { CityModel } from "../models/city.model";

export const citiesController = express.Router();

// Use Authentication
// const keycloak = getKeycloak()
// citiesController.use(keycloak.protect())

// GET cities containing or matching search query param if match=true param is set
citiesController.get('/', async (req, res) => {
    
    await handleResponse(res, async () => {
        const search = req.query.search
        const match = req.query.match

        if(!search) {
            return res.status(500).json({error: "the [search] query parameter is required"})
        }
        // search city contains
        let searchQuery:any = {
            "query": {
                "wildcard": {
                    "name": {
                        "value": `${search}*`
                    }
                }
            }
        }
        if(match && match == 'true') {
            // search the exact city name
            searchQuery = {
                "query": {
                  "bool": {
                    "must": [
                      {
                        "terms": {
                          "name.normalize": [
                            search
                          ]
                        }
                      }
                    ]
                  }
                }
            }
        }

        handleSearch(res, CityModel, searchQuery)
        
    })
    
});