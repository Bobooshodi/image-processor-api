import { v2 as cloudinary } from "cloudinary";
import { createReadStream } from 'streamifier';
import { injectable } from "inversify";
import * as JSZip from 'jszip';

import { ImageUploadFailureResult, ImageUploadResult, ImageUploadSuccessResult } from "../models";
import { ImageUploadServiceInterface } from "./interfaces/ImageUploadServiceInterface";

@injectable()
export class ImageUploadService implements ImageUploadServiceInterface {

  private acceptedFileExtensions = ['png', 'jpg', 'jpeg'];

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDUNARY_CLOUD_NAME,
      api_key: process.env.CLOUDUNARY_API_KEY,
      api_secret: process.env.CLOUDUNARY_API_SECRET,
    });
  }
  fetchAll(): Promise<ImageUploadSuccessResult[]> {
    throw new Error("Method not implemented.");
  }
  async fetchImageUrl(id: string): Promise<string> {
    return cloudinary.url(id);
  }

  async upload(file: Express.Multer.File) {
    const uploadResults: ImageUploadResult = { success: [], failed: [] };
    let uploadResponse: any;

    if (file.mimetype == "application/zip") {
      await JSZip.loadAsync(file.buffer).then(async (zip) => {
        //  console.log(zip.files);
        const allFiles = zip.files;
        let file: JSZip.JSZipObject;

        for (const filePointer in allFiles) {
          file = allFiles[filePointer];
          const isImage = this.isFileAnImage(file.name);
          if (true === isImage) {
            uploadResponse = await this.streamUpload(file.nodeStream());
            uploadResults.success.push({
              fileName: file.name,
              id: uploadResponse.public_id,
              size: uploadResponse.bytes,
              url: uploadResponse.url,
            });
          } else {
            uploadResults.failed.push(isImage as ImageUploadFailureResult);
          }
        }
      });
    } else {
      uploadResponse = await this.streamUpload(createReadStream(file.buffer));
      uploadResults.success.push({
        fileName: file.originalname,
        id: uploadResponse.public_id,
        size: uploadResponse.bytes,
        url: uploadResponse.url,
      });
    }

    return uploadResults;
  }

  private streamUpload(stream: NodeJS.ReadableStream) {
    return new Promise((resolve, reject) => {
      let streamUpload = cloudinary.uploader.upload_stream({ folder: "ImageProcessingAPI", },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      stream.pipe(streamUpload);
    });
  };

  private isFileAnImage = (fileName: string): ImageUploadFailureResult | boolean => {
    const fileNameParts = fileName.split('.');
    if (fileNameParts.length < 2) {
      return { file: fileName, reason: 'FileType cannot be determined' };
    } else if (!this.acceptedFileExtensions.includes(fileNameParts[fileNameParts.length - 1])) {
      return { file: fileName, reason: `File with extension ${fileNameParts[fileNameParts.length - 1]} are not accepted but, Nice Try tho. :)` }
    }

    return true;
  }
}