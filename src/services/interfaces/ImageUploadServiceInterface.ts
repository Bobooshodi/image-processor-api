import { ImageUploadResult } from "../../models";

export interface ImageUploadServiceInterface {
    fetchAll(): Promise<ImageUploadResult[]>;
    fetchImageUrl(id: string): Promise<string>;
    upload(file): Promise<ImageUploadResult>
}