import {PhotoEntity} from "./enitites/PhotoEntity";
import {IRatingManager} from "../interfaces/IRatingManager";
import {SQLConnection} from "./SQLConnection";
import {SQL_COLLATE} from "./enitites/EntityUtils";
import * as path from "path";

export class RatingManager implements IRatingManager {
  public async updateRating(mediaPath: string, newRating: 0 | 1 | 2 | 3 | 4 | 5): Promise<PhotoEntity> {
    const connection = await SQLConnection.getConnection();
    const repository = connection.getRepository(PhotoEntity);

    const mediaName = path.basename(mediaPath);
    const dir = path.dirname(mediaPath);
    const dirName = path.basename(dir);
    const dirPath = path.dirname(dir);

    const query = {
      dirName: dirName,
      dirPath: dirPath,
      mediaName: mediaName
    };

    const photo = await repository
      .createQueryBuilder('photo')
      .limit(1)
      .leftJoin('photo.directory', 'directory')
      .where('photo.name = :mediaName AND directory.name = :dirName', query)
      .getOne();

    photo.metadata.rating = newRating;

    await repository.save(photo);
    return photo;
  }
}
