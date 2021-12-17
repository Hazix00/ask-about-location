import { Response } from "express";
import { Model } from "mongoose"

export const handleResponse = async (res: Response ,callBack: () => Promise<any>) => {
    try {
        await callBack()
    } catch (e:any) {
        res.status(500).send(e.message);
    }
}
// Handle elasticsearch searching
export const handleSearch = (res:Response ,Model: Model<any>, query:any) => {
    //@ts-ignore
    Model.esSearch( query, (err: any, results: any ) => {
        if(err) {
            return res.status(500).json(err)
        }

        res.status(200).json(results.hits.hits);
    })
}
// handle saving document to elasticsearch
export const savieToIndex = (doc: any) => {
    //@ts-ignore
    doc.save(function (err) {
        if (err) throw err;
        //@ts-ignore
        doc.on("es-indexed", function (err, res) {
            if (err) throw err;
        });
    });
}