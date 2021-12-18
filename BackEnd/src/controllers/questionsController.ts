import express from "express";
import { handleResponse, handleSearch, saveToIndex } from "../common/helperFunctions";
import { getKeycloak } from '../config/keycloak-config';
import { Question, QuestionModel } from "../models/question.model";
import { Reply } from "../models/replies.schema";

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
        let sortCriteria:any = { 
            createdAt: {
                order: "desc", 
                format: "strict_date_optional_time_nanos"
            }
        }
        // If coordinates is set, getting questions by distance from coordinates
        if(coordinates && coordinates.lat && coordinates.lng) {
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

        const searchQuety:any = {
            from,
            size,
            sort: [ sortCriteria ]
        }

        handleSearch(res, QuestionModel,searchQuety)
        
    })
    
});

//TODO search by suggested terms

questionsController.post('/', async (req, res) => {
    
    await handleResponse(res, async () => {
        let question: Question = req.body
        question.createdAt = new Date()

        question = await QuestionModel.create(question)
        
        saveToIndex(question)
        return res.status(200).json(question)
    })
})

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