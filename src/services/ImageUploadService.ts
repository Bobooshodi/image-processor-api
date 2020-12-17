import {v2 as cloudinary} from "cloudinary";
import {createReadStream} from 'streamifier';
import { injectable, inject } from "inversify";

import { ImageUploadResult } from "../models";
import { ImageUploadServiceInterface } from "./interfaces/ImageUploadServiceInterface";

@injectable()
export class ImageUploadService implements ImageUploadServiceInterface {
   
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDUNARY_CLOUD_NAME,
            api_key: process.env.CLOUDUNARY_API_KEY,
            api_secret: process.env.CLOUDUNARY_API_SECRET,
          });        
    }
    fetchAll(): Promise<ImageUploadResult[]> {
        throw new Error("Method not implemented.");
    }
    async fetchImageUrl(id: string): Promise<string> {
        return cloudinary.url(id);
    }

    async upload(file) {
        const result: any = await this.streamUpload(file);

        const uploadResult: ImageUploadResult = {
            id: result.public_id,
            size: result.bytes,
            url: result.url,
        }

        return uploadResult;
    }

    private streamUpload(file) {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream({ folder: "ImageProcessingAPI",},
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
    
           createReadStream(file.buffer).pipe(stream);
        });
    };
}