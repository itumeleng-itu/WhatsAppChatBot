import { Request,Response } from "express";
import { fetchLocations } from "../services/location.service";
import { extractQuery, handleControllerError } from "./controllersutils/controllers.utilscontroller";

export const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchLocations(extractQuery(req));
    res.status(200).json(data);
  } catch (error) {
    handleControllerError(res, error, 'locations');

  }
};