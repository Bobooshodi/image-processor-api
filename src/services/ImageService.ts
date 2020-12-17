import { injectable, inject } from "inversify";
import { Mapper } from '@nartc/automapper';
import { getRepository } from "typeorm";

import { ImageServiceInterface } from "./interfaces/ImageServiceInterface";
import { Image } from "../models"
import { ImageEntity } from "../entities";

@injectable()
export class ImageService implements ImageServiceInterface {

    private imageRepository = getRepository(ImageEntity); 

    async getAll() {
        const images = await this.imageRepository.find();

        return Mapper.mapArray(images, Image);
    }

    async getById(id: string): Promise<Image> {
        const imageEntity = await this.imageRepository.findOne(id);

        return Mapper.map(imageEntity, Image);
    }
    async create(model: Image): Promise<Image> {
        const entity = Mapper.map(model, ImageEntity);
        const res = await this.imageRepository.save(entity);
        return Mapper.map(res, Image);
    }
    async update(updatedModel: Image): Promise<Image> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): boolean {
        throw new Error("Method not implemented.");
    }

}