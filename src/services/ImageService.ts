import { injectable, inject } from "inversify";
import { Mapper } from '@nartc/automapper';

import { ImageServiceInterface } from "./interfaces/ImageServiceInterface";
import { Image } from "../models"
import { ImageRepositoryInterface } from "../repositories/interfaces/ImageRepositoryInterface";
import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";

@injectable()
export class ImageService implements ImageServiceInterface {

    private imageRepository: ImageRepositoryInterface;

    public constructor(
        @inject(ServiceInterfaceTypes.RepositoryTypes.ImageRepository) imageRepository: ImageRepositoryInterface,
    ) {
        this.imageRepository = imageRepository;
    }

    async getById(id: string): Promise<Image> {
        const imageEntity = await this.imageRepository.findById(id);

        return Mapper.map(imageEntity, Image);
    }
    async create(model: Image): Promise<Image> {
        throw new Error("Method not implemented.");
    }
    async update(updatedModel: Image): Promise<Image> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): boolean {
        throw new Error("Method not implemented.");
    }

}