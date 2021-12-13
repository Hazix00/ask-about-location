/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import session, { MemoryStore } from "express-session";

import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { initKeycloak } from './config/keycloak-config'


dotenv.config();
/**
 * App Variables
 */ 
if (!process.env.PORT){
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express()
/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());

//keycloak Configuraton
const memoryStore = new MemoryStore();
app.use(session({ 
    secret: 'NFNZQefzsrURjZ88mRYsKUSKUQcfzsWM', 
    resave: false, 
    saveUninitialized: true, 
    store: memoryStore
 }));
const keycloak = initKeycloak(memoryStore)
app.use(keycloak.middleware({logout: '/logout', admin: '/'}))

// Routes
const testController = require('./controllers/testController').testController
app.use('/api/test', testController)

app.get('/', (req, res) => {
    res.send("Server is up!");
});
//Error handlers
app.use(errorHandler);
app.use(notFoundHandler);
/**
 * Server Activation
 */
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});