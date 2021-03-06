/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import session, { MemoryStore } from "express-session";
import mongoose from "mongoose"

import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { initKeycloak } from './config/keycloak-config'

import { FavoriteModel } from "./models/favorite.model";
import { CityModel } from "./models/city.model";
import { QuestionModel } from "./models/question.model";



dotenv.config();
/**
 * App Variables
 */ 
if (!process.env.PORT){
    process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);
const keycloakConfig = require('../keycloak.json')
const memoryStore = new MemoryStore();


const app = express()
/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 *  Keycloak Configuration
 */
app.use(session({ 
    secret: keycloakConfig.credentials.secret, 
    resave: false, 
    saveUninitialized: true, 
    store: memoryStore
 }));
const keycloak = initKeycloak(memoryStore)
app.use(keycloak.middleware())

/**
 * Routes 
 */
const { citiesController } = require('./controllers/citiesController')
const { questionsController } = require('./controllers/questionsController')
const { userFavoriteQuestionsController } = require('./controllers/userFavoriteQuestionsController')
app.use('/api/cities', citiesController)
app.use('/api/questions', questionsController)
app.use('/api/favorites', userFavoriteQuestionsController)

/**
 * Error handlers  
 */
app.use(errorHandler);
app.use(notFoundHandler);

/**
 * DB Config  
 */
mongoose.connect(process.env.MONGO_URI as string)

// Mapping Collections to Elasticksearch and synchronize cities
// CityModel.esTruncate(err => console.log(err))
// CityModel.createMapping((err, mapping) => {
//     console.log('CityModel mapping created')
// })
// QuestionModel.createMapping((err, mapping) => {
//     console.log('QuestionModel mapping created')
// })

// FavoriteModel.createMapping((err, mapping) => {
//     console.log('FavoriteModel mapping created')
// })

// let stream = CityModel.synchronize();
// let count:number = 0;
// stream.on('data', (err, doc) => {
//     count++;
// });
// stream.on('close', () => {
//     console.log('indexed ' + count + ' documents!');
// });
// stream.on('error', (err) => {
//   console.log("Error while synchronizing" + err);
// });

/**
 * Server Activation
 */
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})