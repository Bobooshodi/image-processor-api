import { AutoMapper, mapFrom, ProfileBase } from '@nartc/automapper';
import { ImageEntity } from '../entities';
import { Image } from '../models';

export class ImageMappingProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(ImageEntity, Image)
    .forMember(m => m.id, mapFrom(src => src.uuid))
    .forMember(m => m.dateCreated, mapFrom(src => src.dateCreated))
    .forMember(m => m.dateUpdated, mapFrom(src => src.dateUpdated))
    .reverseMap();
  }
}