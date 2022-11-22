import { IObjectManager } from './IObjectManager';
import {PhotoDTO} from '../../../../common/entities/PhotoDTO';
import {PhotoEntity} from "../sql/enitites/PhotoEntity";

export interface IRatingManager extends IObjectManager {
  updateRating(mediaPath: string, newRating: 0 | 1 | 2 | 3 | 4 | 5): Promise<PhotoEntity>;
}
