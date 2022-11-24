import {PhotoEntity} from "./enitites/PhotoEntity";
import {IRatingManager} from "../interfaces/IRatingManager";
import {SQLConnection} from "./SQLConnection";
import {promises as fsp} from 'fs';
import * as path from "path";
import {ProjectPath} from "../../../ProjectPath";

interface RatingBufferEntry {
  fullPath: string,
  rating: (0 | 1 | 2 | 3 | 4 | 5),
}

export class RatingManager implements IRatingManager {
  private ratingBuffer: RatingBufferEntry[] = [];
  private timeout: any = null;

  public async writeBuffer(): Promise<void> {
    const theContent = this.ratingBuffer.map((itm) => itm.rating + '|' + itm.fullPath).join("\n") + "\n";
    this.ratingBuffer = [];

    await fsp.appendFile(path.join(ProjectPath.ImageFolder, 'ratings_buffer.csv'), theContent);
  }

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

    if (!photo) {
      throw new Error('Photo not found');
    }

    photo.metadata.rating = newRating;

    const absoluteFileName = path.join(
      ProjectPath.ImageFolder,
      path.normalize(mediaPath)
    );


    this.ratingBuffer.push({
      fullPath: absoluteFileName,
      rating: newRating,
    });

    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null;
    }

    this.timeout = setTimeout(() => {
      this.writeBuffer();
    }, 6000);

    await repository.save(photo);
    return photo;
  }
}
