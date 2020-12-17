import { ImageServiceInterface } from "./interfaces/ImageServiceInterface";
import { Image } from "../models"

export class ImageService implements ImageServiceInterface {
    getById(id: string): () => Image {
        throw new Error("Method not implemented.");
    }
    create(model: Image): Image {
        throw new Error("Method not implemented.");
    }
    update(updatedModel: Image): Image {
        throw new Error("Method not implemented.");
    }
    delete(id: string): boolean {
        throw new Error("Method not implemented.");
    }

}