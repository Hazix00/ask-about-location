import express from "express";
import { handleSearch } from "../common/handle-elastic-response";
import { handleResponse } from "../common/handle-response";
import { getKeycloak } from '../config/keycloak-config'
import { QuestionModel } from "../models/question.model";

export const questionsController = express.Router();

// Use Authentication
// const keycloak = getKeycloak()
// questionsController.use(keycloak.protect())

// GET questions
questionsController.get('/', async (req, res) => {
    
    await handleResponse(res, async () => {

        let from = req.body.from ? req.body.from : 0
        let size = req.body.size ? req.body.size : 10

        const coordinates = req.body.coordinates
        // By default getting questions ordered by creation date
        let searchCriteria:any = { 
            createdAt: {
                order: "desc", 
                format: "strict_date_optional_time_nanos"
            }
        }
        // If coordinates is set , getting questions by distance from coordinates
        if(coordinates && coordinates.lat && coordinates.lng) {
            searchCriteria = {
                _geo_distance: {
                    "city.coordinate": {
                        lat: coordinates.lat,
                        lon: coordinates.lng
                    },
                    order : "asc",
                    unit : "km"
                }
            } 
        }

        const searchQuety:any = {
            from,
            size,
            sort: [ searchCriteria ]
        }

        handleSearch(res, QuestionModel,searchQuety)
        
    })
    
});
