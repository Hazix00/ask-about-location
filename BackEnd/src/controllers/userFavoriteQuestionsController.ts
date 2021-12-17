import express from "express";
import { handleResponse, handleSearch } from "../common/helperFunctions";
import { getKeycloak } from "../config/keycloak-config";
import { Favorite, FavoriteModel } from "../models/favorite.model";
import { QuestionModel } from "../models/question.model";

export const userFavoriteQuestionsController = express.Router();

// Use Authentication
// const keycloak = getKeycloak()
// userFavoriteQuestionsController.use(keycloak.protect())

// GET cities containing or matching search query param if match=true param is set
userFavoriteQuestionsController.get("/", async (req, res) => {
  await handleResponse(res, async () => {
    
    let from = req.body.from ? req.body.from : 0
    let size = req.body.size ? req.body.size : 10
    const user = req.body.user;

    if (!user || !user.username || !user.email) {
      return res
        .status(500)
        .json({
          error: "the [user with username and email] is required in the body",
        });
    }

    let userFavoriteId: string;
    let userFavorite: Favorite = await FavoriteModel.findOne({
      "user.username": user.username,
      "user.email": user.email,
    });

    if (userFavorite) {
      userFavoriteId = userFavorite.id;
    } else {
      userFavorite = {
        id: "",
        user,
        favoriteQuestionsIds: [],
      } as Favorite;
      const resultUserFavorite = await FavoriteModel.create(userFavorite);
      userFavoriteId = resultUserFavorite.id;

      // Save to the index favorites
      //@ts-ignore
      resultUserFavorite.save(function (err) {
        if (err) throw err;
        //@ts-ignore
        resultUserFavorite.on("es-indexed", function (err, res) {
          if (err) throw err;
        });
      });
    }
    let searchQuery = {
        from,
        size,
        query: {
            terms: {
            _id: {
                index: "favorites",
                type: "_doc",
                id: userFavoriteId,
                path: "favoriteQuestionsIds.questionId",
            },
            },
        },
    };

    handleSearch(res, QuestionModel, searchQuery);
  });
});
