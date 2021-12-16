import express from "express";
import { handleSearch } from "../common/handle-elastic-response";
import { handleResponse } from "../common/handle-response";
import { getKeycloak } from '../config/keycloak-config'
import { CityModel } from "../models/city.model";

export const citiesController = express.Router();
const keycloak = getKeycloak()
// GET cities containing search query param
citiesController.get('/contains', async (req, res) => {
    
    await handleResponse(res, async () => {
        const searchQuery = req.query.search

        if(!searchQuery) {
            return res.status(500).json({error: "the [search] query parameter is required"})
        }

        handleSearch(res, CityModel,{
            "query": {
                "wildcard": {
                    "name": {
                        "value": `*${searchQuery}*`
                    }
                }
            }
        })
        
    })
    
});
// GET city matching query param
citiesController.get('/match', async (req, res) => {
    await handleResponse(res, async () => {
        let searchQuery = req.query.search

        if(!searchQuery) {
            return res.status(502).json({error: "the [search] query parameter is required"})
        }
        searchQuery = searchQuery as string;
        searchQuery = searchQuery!.charAt(0).toUpperCase() + searchQuery!.slice(1)
        handleSearch(res, CityModel, {
            "query": {
                "match": {
                    "name": {
                    "query": searchQuery
                    }
                }
            }
        })
    })
})