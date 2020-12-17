import { AutoMapper, mapFrom, ProfileBase } from '@nartc/automapper';
import { ImageEntity } from '../entities';
import { Image } from '../models';

export class ImageMappingProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(ImageEntity, Image)
    .forMember(m => m.id, mapFrom(src => src.uuid))
    .reverseMap();
  }
}