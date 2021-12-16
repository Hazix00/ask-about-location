import { Response } from "express";
import { Model } from "mongoose"

export const handleSearch = (res:Response ,Model: Model, query:any) => {
    Model.esSearch( query, (err: any, results: any ) => {
        if(err) {
            return res.status(500).json(err)
        }

        res.status(200).json(results.hits.hits);
    })
}