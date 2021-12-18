import express from "express";
import { handleResponse, handleSearch, saveToIndex } from "../common/helperFunctions";
import { getKeycloak } from '../config/keycloak-config';
import { Question, QuestionModel } from "../models/question.model";
import { Reply } from "../models/replies.schema";

export const questionsController = express.Router();

// Use Authentication
// const keycloak = getKeycloak()
// questionsController.use(keycloak.protect())

// GET /questions 
// { 
// 	"from": number, //OPTIONAL, DEFAULT 0
// 	"size": number, //OPTIONAL, DEFAULT 10
// 	"coordinates": {
// 		"lat": number, // REQUIRED
// 		"lng": number  // REQUIRED
// 	}, //OPTIONAL
// 	"search": {
// 		"value" : string, // REQUIRED
// 		"fields" : string[] // REQUIRED
// 	} //OPTIONAL
// } //OPTIONAL DEFAULT GET results sorted by date DESC
questionsController.get('/', async (req, res) => {
    
    await handleResponse(res, async () => {

        let from = req.body.from ? req.body.from : 0
        let size = req.body.size ? req.body.size : 10
        const search: {value: string, fields: string[]} = req.body.search

        const coordinates = req.body.coordinates
        // By default getting questions ordered by creation date
        let sortCriteria:any = { 
            createdAt: {
                order: "desc", 
                format: "strict_date_optional_time_nanos"
            }
        }
        // If coordinates is set, getting questions by distance from coordinates
        if(!search && coordinates && coordinates.lat && coordinates.lng) {
            sortCriteria = {
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
        let searchQuety:any = {
            from,
            size,
            sort: [ sortCriteria ]
        }
        // if search is set, search in title and content
        if(search) {

            if(!search.value || !search.fields || !Array.isArray(search.fields) ) {
                return res.status(500).json({
                    error: "search object must be of type { value:string, fields: string[] }"
                }) 
            }
            if(search.fields.length == 0) {
                return res.status(500).json({
                    error: "search.fields is empty "
                }) 
            }

            searchQuety.query = {
                multi_match : {
                    query: search.value,
                    type: "best_fields",
                    fields: search.fields,
                    tie_breaker: 0.3
                }
            }
        }

        handleSearch(res, QuestionModel,searchQuety)
        
    })
    
});

//POST /questions 
// {
// 	"title": string,
// 	"content": string,
// 	"city": {
// 		"name": string, 
// 		"coordinate": {
// 			"lat": number,
// 			"lon": number
// 		}
// 	},
// 	"user": {
// 		"username": string,
// 		"email": string
// 	}
// } ALL FIELDS ARE REQUIRED
questionsController.post('/', async (req, res) => {
    
    await handleResponse(res, async () => {
        let question: Question = req.body
        question.createdAt = new Date()

        question = await QuestionModel.create(question)
        
        saveToIndex(question)
        return res.status(200).json(question)
    })
})

// POST /questions/reply
// {
// 	"questionId": string,
// 	"reply": {
// 		"content": string,
// 		"user": {
// 			"username": string,
// 			"email": string
// 		}
// 	}
// } ALL FIELDS ARE REQUIRED
questionsController.post('/reply', async (req, res) => {
    
    await handleResponse(res, async () => {

        let questionId: string = req.body.questionId
        let reply: Reply = req.body.reply

        if(!questionId || !reply) {
            return res.status(500).json({
                error: "the body must contain [questionId] and [reply]"
            }) 
        }

        let question: Question | null = await QuestionModel.findById(questionId)
        if(!question) {
            return res.status(404).json({
                error: `Question of id : ${questionId} was not found in the database`
            })
        }

        reply.createdAt = new Date()
        question.replies.push(reply)
        await QuestionModel.validate(question)
        
        question = await QuestionModel.findByIdAndUpdate(questionId, question, {new: true})
        
        saveToIndex(question)
        return res.status(200).json(question)

    })
})