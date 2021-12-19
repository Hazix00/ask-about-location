import express from "express";
import { handleResponse, handleSearch, saveToIndex } from "../common/helperFunctions";
import { getKeycloak } from '../config/keycloak-config';
import { Question, QuestionModel } from "../models/question.model";
import { Reply } from "../models/replies.schema";

export const questionsController = express.Router();

// Use Authentication
const keycloak = getKeycloak()

// GET /questions?page=0&limit=10&lat=value&lon=value&search=value&field=title&filed=content&field=city.name
// page OPTIONAL default 1
// limit OPTIONAL default 10
// lat OPTIONAL if no lon and the same for 'lon'
// search OPTIONAL
// field OPTIONAL if no search
// field must be in one or more of ['title', 'content', 'city.name']
questionsController.get('/', async (req, res) => {
    
    await handleResponse(res, async () => {

        let {page, limit, search, field ,lat, lon,  } = req.query
        
        // if limit is undefined set to 10
        const size = limit ? Number(limit) : 10
        const pageNumber = !page || Number(page) <= 0 ? 1 : Number(page)

        // By default getting questions ordered by creation date
        let sortCriteria:any = { 
            createdAt: {
                order: "desc", 
                format: "strict_date_optional_time_nanos"
            }
        }
        // If coordinates is set, getting questions by distance from coordinates
        if(!search && lat && lon) {
            sortCriteria = {
                _geo_distance: {
                    "city.coordinate": { lat, lon },
                    order : "asc",
                    unit : "km"
                }
            } 
        }
        if(lat && !lon) 
            return res.status(500).json({ error: "Both lat and lon should be set"})

        let searchQuery:any = {
            from: page ? (pageNumber - 1) * size: 0,
            size,
            _source: {
                exclude:["replies"]
            },
            sort: [ sortCriteria ]
        }
        // if search is set, search in title and content
        if(search) {
            
            if(!field) {
                return res.status(500).json({
                    error: "fields query param is empty"
                }) 
            }
            
            const fields = Array.isArray(field) ? field : [field]
            const allowedFields = ['title', 'content', 'city.name']
            
            for (const f of fields) {
                if(!allowedFields.includes(f as string))
                    return res.status(500).json({ error: "field must be in ['title', 'content', 'city.name']" })
            }

            searchQuery.query = {
                multi_match : {
                    query: search,
                    type: "best_fields",
                    fields: fields,
                    tie_breaker: 0.3
                }
            }
        }

        handleSearch(res, QuestionModel,searchQuery)
        
    })
    
});

// GET /questions/:questionId
questionsController.get('/:questionId', async (req, res) => {
    
    await handleResponse(res, async () => {
        
        const searchQuery = {
            query: {
                term: {
                    _id: req.params.questionId
                }
            }
        }
        handleSearch(res, QuestionModel, searchQuery)

    })
})

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
questionsController.post('/', keycloak.protect(), async (req, res) => {
    
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
questionsController.post('/reply', keycloak.protect(), async (req, res) => {
    
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
        return res.status(200).json(reply)

    })
})