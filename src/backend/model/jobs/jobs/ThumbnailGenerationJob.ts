import {Config} from '../../../../common/config/private/Config';
import {DefaultsJobs} from '../../../../common/entities/job/JobDTO';
import {ProjectPath} from '../../../ProjectPath';
import * as path from 'path';
import {FileJob} from './FileJob';
import {PhotoProcessing} from '../../fileprocessing/PhotoProcessing';
import {ThumbnailSourceType} from '../../threading/PhotoWorker';
import {MediaDTO} from '../../../../common/entities/MediaDTO';
import {FileDTO} from '../../../../common/entities/FileDTO';

const LOG_TAG = '[ThumbnailGenerationJob]';


export class ThumbnailGenerationJob extends FileJob<{ sizes: number[], indexedOnly: boolean }> {

  public readonly Name = DefaultsJobs[DefaultsJobs['Thumbnail Generation']];

  constructor() {
    super({noMetaFile: true});
    this.ConfigTemplate.push({
      id: 'sizes',
      type: 'number-array',
      name: 'Sizes to generate',
      defaultValue: [Config.Client.Media.Thumbnail.thumbnailSizes[0]]
    });
  }

  public get Supported(): boolean {
    return true;
  }

  start(config: { sizes: number[], indexedOnly: boolean }): Promise<void> {
    for (let i = 0; i < config.sizes.length; ++i) {
      if (Config.Client.Media.Thumbnail.thumbnailSizes.indexOf(config.sizes[i]) === -1) {
        throw new Error('unknown thumbnails size: ' + config.sizes[i] + '. Add it to the possible thumbnail sizes.');
      }
    }

    return super.start(config);
  }

  protected async filterMediaFiles(files: FileDTO[]): Promise<FileDTO[]> {
    return files;
  }

  protected async filterMetaFiles(files: FileDTO[]): Promise<FileDTO[]> {
    return undefined;
  }

  protected async shouldProcess(file: FileDTO): Promise<boolean> {
    const mPath = path.join(ProjectPath.ImageFolder, file.directory.path, file.directory.name, file.name);
    for (let i = 0; i < this.config.sizes.length; ++i) {
      if (!(await PhotoProcessing.convertedPhotoExist(mPath, this.config.sizes[i]))) {
        return true;
      }
    }
  }

  protected async processFile(file: FileDTO): Promise<void> {

    const mPath = path.join(ProjectPath.ImageFolder, file.directory.path, file.directory.name, file.name);
    for (let i = 0; i < this.config.sizes.length; ++i) {
      await PhotoProcessing.generateThumbnail(mPath,
        this.config.sizes[i],
        MediaDTO.isVideo(file) ? ThumbnailSourceType.Video : ThumbnailSourceType.Photo,
        false);

    }
  }


}
