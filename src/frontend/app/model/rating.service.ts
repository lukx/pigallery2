import {Injectable} from '@angular/core';
import {NetworkService} from './network/network.service';
import {PhotoDTO} from "../../../common/entities/PhotoDTO";
import {Util} from "leaflet";
import getParamString = Util.getParamString;
import {QueryService} from "./query.service";
import {Utils} from "../../../common/Utils";

@Injectable()
export class RatingService {

  constructor(private networkService: NetworkService, private queryService: QueryService) {
  }

  async updateRating(
    photo: PhotoDTO,
    newRating: number
  ): Promise<void> {

    const filePath = Utils.concatUrls(
      photo.directory.path,
      photo.directory.name,
      photo.name
    );

    const url = NetworkService.buildUrl('/gallery/content/' + filePath + '/rating');
    //, this.queryService.getParams(photo)

    await this.networkService.putJson(url, {
      rating: Math.floor(newRating)
    });
    photo.metadata.rating = newRating as (0 | 1 | 2 | 3 | 4 | 5);
  }
}
