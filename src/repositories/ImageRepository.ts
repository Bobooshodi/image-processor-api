import {EntityRepository, Repository} from "typeorm";
import { injectable } from "inversify";

import { ImageEntity } from "../entities";
import { ImageRepositoryInterface } from "./interfaces/ImageRepositoryInterface";

@injectable()
@EntityRepository(ImageEntity)
export class ImageRepository extends Repository<ImageEntity> implements ImageRepositoryInterface {
    createAndSave(entity: ImageEntity): Promise<ImageEntity> {
        throw new Error("Method not implemented.");
    }
    
    findById(id: string) {
        return this.findOne({ uuid: id });
    }
}