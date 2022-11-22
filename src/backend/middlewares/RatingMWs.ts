import {NextFunction, Request, Response} from 'express';
import {ErrorCodes, ErrorDTO} from '../../common/entities/Error';
import {ObjectManagers} from '../model/ObjectManagers';
import {
  PersonDTO,
  PersonWithSampleRegion,
} from '../../common/entities/PersonDTO';
import {Utils} from '../../common/Utils';
import path = require("path");

export class RatingMWs {
  public static async updateRating(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.params['mediaPath']) {
      return next();
    }

    if (!req.body.rating && req.body.rating !== 0) {
      return next(new ErrorDTO(ErrorCodes.INPUT_ERROR, 'Please provide a valid rating number'));
    }
    const mediaPathId = req.params['mediaPath'];

    const rating = Math.floor(Math.max(0, Math.min(5, req.body.rating)));

    // load parameters

    try {
      req.resultPipe =
        await ObjectManagers.getInstance().RatingManager.updateRating(
          mediaPathId,
          rating as (0|1|2|3|4|5)
        );
      return next();
    } catch (err) {
      return next(
        new ErrorDTO(
          ErrorCodes.GENERAL_ERROR,
          'Error during updating a rating',
          err
        )
      );
    }
  }

}


