import { Response } from "express";

export const handleResponse = async (res: Response ,callBack: () => Promise<any>) => {
    try {
      await callBack()
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  }