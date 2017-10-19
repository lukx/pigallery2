import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {DirectoryDTO} from "../../../../common/entities/DirectoryDTO";
import {
  CameraMetadata,
  GPSMetadata,
  ImageSize,
  PhotoDTO,
  PhotoMetadata,
  PositionMetaData
} from "../../../../common/entities/PhotoDTO";
import {DirectoryEntity} from "./DirectoryEntity";

@Entity()
export class PhotoEntity implements PhotoDTO {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @ManyToOne(type => DirectoryEntity, directory => directory.photos, {onDelete: "CASCADE"})
  directory: DirectoryDTO;

  @Column(type => PhotoMetadataEntity)
  metadata: PhotoMetadataEntity;

  readyThumbnails: Array<number> = [];

  readyIcon: boolean = false;

}


@Entity()
export class PhotoMetadataEntity implements PhotoMetadata {

  @Column("simple-array")
  keywords: Array<string>;

  @Column(type => CameraMetadataEntity)
  cameraData: CameraMetadataEntity;

  @Column(type => PositionMetaDataEntity)
  positionData: PositionMetaDataEntity;

  @Column(type => ImageSizeEntity)
  size: ImageSizeEntity;

  @Column("bigint")
  creationDate: number;

  @Column("int")
  fileSize: number;
  /*
    //TODO: fixit after typeorm update
    public static open(m: PhotoMetadataEntity) {
      m.keywords = <any>JSON.parse(<any>m.keywords);
      m.cameraData = <any>JSON.parse(<any>m.cameraData);
      m.positionData = <any>JSON.parse(<any>m.positionData);
      m.size = <any>JSON.parse(<any>m.size);
    }

    //TODO: fixit after typeorm update
    public static close(m: PhotoMetadataEntity) {
      m.keywords = <any>JSON.stringify(<any>m.keywords);
      m.cameraData = <any>JSON.stringify(<any>m.cameraData);
      m.positionData = <any>JSON.stringify(<any>m.positionData);
      m.size = <any>JSON.stringify(<any>m.size);
    }*/
}


@Entity()
export class CameraMetadataEntity implements CameraMetadata {

  @Column("text", {nullable: true})
  ISO: number;

  @Column("text", {nullable: true})
  model: string;

  @Column("text", {nullable: true})
  maker: string;

  @Column("int", {nullable: true})
  fStop: number;

  @Column("int", {nullable: true})
  exposure: number;

  @Column("int", {nullable: true})
  focalLength: number;

  @Column("text", {nullable: true})
  lens: string;
}


@Entity()
export class PositionMetaDataEntity implements PositionMetaData {

  @Column(type => GPSMetadataEntity)
  GPSData: GPSMetadataEntity;

  @Column("text", {nullable: true})
  country: string;

  @Column("text", {nullable: true})
  state: string;

  @Column("text", {nullable: true})
  city: string;
}


@Entity()
export class GPSMetadataEntity implements GPSMetadata {

  @Column("int", {nullable: true})
  latitude: number;
  @Column("int", {nullable: true})
  longitude: number;
  @Column("int", {nullable: true})
  altitude: number;
}

@Entity()
export class ImageSizeEntity implements ImageSize {

  @Column("int")
  width: number;

  @Column("int")
  height: number;
}
