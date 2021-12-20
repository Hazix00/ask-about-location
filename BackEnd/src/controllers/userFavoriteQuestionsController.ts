import express from "express";
import { handleResponse, handleSearch, saveToIndex } from "../common/helperFunctions";
import { getKeycloak } from "../config/keycloak-config";
import { Favorite, FavoriteModel } from "../models/favorite.model";
import { Question, QuestionModel } from "../models/question.model";

export const userFavoriteQuestionsController = express.Router();

// Use Authentication
const keycloak = getKeycloak()
userFavoriteQuestionsController.use(keycloak.protect())

// handle getting Favorite document of the user from mongodb
const checkUserFavorites = async (req:any): Promise<Favorite> => {

    const { email, preferred_username } = req.kauth.grant.access_token.content


    let userFavorite: Favorite = await FavoriteModel.findOne({
        "user.username": preferred_username,
        "user.email": email,
    })
    if(!userFavorite){
        //create new document for the user if not exists
        userFavorite = {
            id: "",
            user: {
                username: preferred_username,
                email
            },
            favoriteQuestionsIds: [],
        } as Favorite;
        userFavorite = await FavoriteModel.create(userFavorite);

        // Save to the index favorites
        saveToIndex(userFavorite) 
    }
    return userFavorite;
}

// GET /favorites questions
// page OPTIONAL default 1
// limit OPTIONAL default 10
userFavoriteQuestionsController.get("/", async (req, res) => {
  await handleResponse(res, async () => {
    
    let { page, limit } = req.query
    //@ts-ignore
    
    // if limit is undefined set to 10
    const size = limit ? Number(limit) : 10
    const pageNumber = !page || Number(page) <= 0 ? 1 : Number(page)

    // get the favorite document from mongodb
    let userFavorite: Favorite = await checkUserFavorites(req)

    let searchQuery = {
        from: page ? (pageNumber - 1) * size: 0,
        size,
        query: {
            terms: {
            _id: {
                index: "favorites",
                type: "_doc",
                id: userFavorite.id,
                path: "favoriteQuestionsIds.questionId",
            },
            },
        },
    };

    handleSearch(res, QuestionModel, searchQuery);
  });
});

userFavoriteQuestionsController.get("/question-ids", async (req, res) => {
    await handleResponse(res, async () => {
             
        await checkUserFavorites(req)
        //@ts-ignore
        const { email, preferred_username } = req.kauth.grant.access_token.content
    
        let searchQuery = {
            query: {
                bool: {
                    must: [
                        {
                            match: {
                            "user.username": preferred_username
                            }
                        },
                        {
                            match: {
                            "user.email": email
                            }
                        }
                    ]
                }
            },
        };
    
        handleSearch(res, FavoriteModel, searchQuery);
    });
});

// POST /favorites
// {
//     questionId: string
// }
userFavoriteQuestionsController.post('/', async (req, res) => {
    await handleResponse(res, async () => {
        const questionId = req.body.questionId
        if (!questionId) {
            throw new Error("the [questionId] is required")
        }
        //Check question exists in mongodb
        const question: Question | null = await QuestionModel.findById(questionId)
        if(!question){
            return res.status(404).json({ 
                error: `Question of id : ${questionId} was not found in the database` 
            })
        }

        // get the favorite document from mongodb
        let userFavorite: Favorite = await checkUserFavorites(req)

        
        if(userFavorite) {
            const questionIdExists = userFavorite.favoriteQuestionsIds.find( favQ => favQ.questionId == questionId)
            if(questionIdExists){
                throw new Error("Question already in favorites")
            }

            userFavorite.favoriteQuestionsIds.push({
                questionId,
                createdAt: new Date()
            })
            // Sync changes to the index
            saveToIndex(userFavorite)

            res.status(200).json({ message: "Question added to favorites" })
        }
    })
})

// DELETE /favorites/:questionId
userFavoriteQuestionsController.delete('/:questionId', async (req, res) => {
    await handleResponse(res, async () => {
        const questionId = req.params.questionId
        if (!questionId) {
            throw new Error("the [questionId] is required")
        }

        // get the favorite document from mongodb
        let userFavorite: Favorite = await checkUserFavorites(req)
        
        if(userFavorite) {
            // get the other Qs if exists in Array
            
            userFavorite = await FavoriteModel.findByIdAndUpdate(userFavorite.id, {
                $pull: {
                   "favoriteQuestionsIds": {
                      "questionId": questionId
                   }
                }
             }, { new: true })
            // Sync changes to the index
            saveToIndex(userFavorite)

            return res.status(204).end()
        }
    })
})