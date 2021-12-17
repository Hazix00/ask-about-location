import express from "express";
import { handleResponse, handleSearch, saveToIndex } from "../common/helperFunctions";
import { getKeycloak } from "../config/keycloak-config";
import { Favorite, FavoriteModel } from "../models/favorite.model";
import { Question, QuestionModel } from "../models/question.model";

export const userFavoriteQuestionsController = express.Router();

// Use Authentication
// const keycloak = getKeycloak()
// userFavoriteQuestionsController.use(keycloak.protect())

// handle getting Favorite document of the user from mongodb
const checkUserFavorites = async (res:any , user:any): Promise<Favorite> => {

    if (!user || !user.username || !user.email) {
        res.status(500).json({
            error: "the [user with username and email] is required in the body"
        })
        return res.end()
    }
    let userFavorite: Favorite = await FavoriteModel.findOne({
        "user.username": user.username,
        "user.email": user.email,
    })
    if(!userFavorite){
        //create new document for the user if not exists
        userFavorite = {
            id: "",
            user,
            favoriteQuestionsIds: [],
        } as Favorite;
        userFavorite = await FavoriteModel.create(userFavorite);

        // Save to the index favorites
        saveToIndex(userFavorite) 
    }
    return userFavorite;
}

// GET cities containing or matching search query param if match=true param is set
userFavoriteQuestionsController.get("/", async (req, res) => {
  await handleResponse(res, async () => {
    
    let from = req.body.from ? req.body.from : 0
    let size = req.body.size ? req.body.size : 10
    const user = req.body.user;

    // get the favorite document from mongodb
    let userFavorite: Favorite = await checkUserFavorites(res, user)

    let searchQuery = {
        from,
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

userFavoriteQuestionsController.post('/', async (req, res) => {
    await handleResponse(res, async () => {
        const questionId = req.body.questionId
        if (!questionId) {
            return res.status(500).json({
                error: "the [questionId] is required in the body"
            })
        }
        //Check question exists in mongodb
        const question: Question | null = await QuestionModel.findById(questionId)
        if(!question){
            return res.status(404).json({ error: `Question of id : ${questionId} was not found in the database` })
        }

        const user = req.body.user
        // get the favorite document from mongodb
        let userFavorite: Favorite = await checkUserFavorites(res, user)
        
        if(userFavorite) {
            userFavorite.favoriteQuestionsIds.push({
                questionId,
                createdAt: new Date()
            })
            // Sync changes to the index
            saveToIndex(userFavorite)

            res.status(200).json(userFavorite)
        }
    })
})