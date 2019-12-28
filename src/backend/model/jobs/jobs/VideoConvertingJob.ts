import {Config} from '../../../../common/config/private/Config';
import {DefaultsJobs} from '../../../../common/entities/job/JobDTO';
import {ProjectPath} from '../../../ProjectPath';
import * as path from 'path';
import {FileJob} from './FileJob';
import {VideoProcessing} from '../../fileprocessing/VideoProcessing';
import {FileDTO} from '../../../../common/entities/FileDTO';

const LOG_TAG = '[VideoConvertingJob]';


export class VideoConvertingJob extends FileJob {
  public readonly Name = DefaultsJobs[DefaultsJobs['Video Converting']];

  constructor() {
    super({noPhoto: true, noMetaFile: true});
  }

  public get Supported(): boolean {
    return Config.Client.Media.Video.enabled === true;
  }

  protected async shouldProcess(file: FileDTO): Promise<boolean> {
    const mPath = path.join(ProjectPath.ImageFolder, file.directory.path, file.directory.name, file.name);
    return !(await VideoProcessing.convertedVideoExist(mPath));
  }

  protected async processFile(file: FileDTO): Promise<void> {
    const mPath = path.join(ProjectPath.ImageFolder, file.directory.path, file.directory.name, file.name);
    await VideoProcessing.convertVideo(mPath);
  }


}
