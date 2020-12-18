import { ImageUploadResult, ImageUploadSuccessResult } from "../../models";

export interface ImageUploadServiceInterface {
    fetchAll(): Promise<ImageUploadSuccessResult[]>;
    fetchImageUrl(id: string): Promise<string>;
    upload(file): Promise<ImageUploadResult>
}