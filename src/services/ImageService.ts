import { inject, injectable } from "inversify";
import { Mapper } from '@nartc/automapper';
import { getRepository } from "typeorm";

import { ImageServiceInterface } from "./interfaces/ImageServiceInterface";
import { Image } from "../models"
import { ImageEntity } from "../entities";
import { ImageUploadServiceInterface } from "./interfaces/ImageUploadServiceInterface";
import { ServiceInterfaceTypes } from "../service-container/ServiceTypes";

@injectable()
export class ImageService implements ImageServiceInterface {

    private imageRepository = getRepository(ImageEntity);
    private imageUploader: ImageUploadServiceInterface;

    public constructor(
        @inject(ServiceInterfaceTypes.ServiceTypes.imageUploadService) imageUploader: ImageUploadServiceInterface
    ) {
        this.imageUploader = imageUploader;
    }

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
    async delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async createAndSave(file: Express.Multer.File, description: string = null): Promise<any> {
        const uploadResults = await this.imageUploader.upload(file);

        const images = uploadResults.success.map(res =>
            this.imageRepository.create({
                name: res.id,
                title: res.fileName,
                size: res.size,
                description
            }));

        await this.imageRepository.save(images);

        const successfulStats = {
            count: uploadResults.success.length,
            results: uploadResults.success.map(res => ({ file: res.fileName, url: res.url, thumbnails: res.thumbnails.map(t => ({ file: t.fileName, url: t.url })) }))
        };

        const failedStats = {
            count: uploadResults.failed.length,
            reasons: uploadResults.failed
        };

        return {
            success: successfulStats.count > 0 ? successfulStats : undefined,
            failed: failedStats.count > 0 ? failedStats : undefined
        }
    }
}