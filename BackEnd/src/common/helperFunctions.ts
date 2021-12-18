import { Response } from "express";
import { MongoosasticModel } from "mongoose"

export const handleResponse = async (res: Response ,callBack: () => Promise<any>) => {
    try {
        await callBack()
    } catch (e:any) {
        console.log(e.message)
        return res.status(500).send(e.message);
    }
}
// Handle elasticsearch searching
export const handleSearch = (res:Response ,Model: MongoosasticModel<any>, query:any) => {
    Model.esSearch( query, {}, (err: any, results: any ) => {
        if(err) {
            return res.status(500).json(err)
        }

        return res.status(200).json(results.hits.hits);
    })
}
// handle saving document to elasticsearch
export const saveToIndex = (doc: any) => {
    //@ts-ignore
    doc.save(function (err) {
        if (err) throw err;
        //@ts-ignore
        doc.on("es-indexed", function (err, res) {
            if (err) throw err;
        });
    });
}