import { v2 as cloudinary } from "cloudinary";
import { createReadStream } from 'streamifier';
import { injectable } from "inversify";
import * as JSZip from 'jszip';
import sharp from 'sharp';

import { ImageUploadFailureResult, ImageUploadResult, ImageUploadSuccessResult } from "../models";
import { ImageUploadServiceInterface } from "./interfaces/ImageUploadServiceInterface";

@injectable()
export class ImageUploadService implements ImageUploadServiceInterface {

  private acceptedFileExtensions = ['png', 'jpg', 'jpeg'];
  private thmbnailWidths = [32, 64];

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

  processUpload = async (fileBuffer: Buffer, fileName: string) => {
    let sharpObj = sharp(fileBuffer);
    const fileMetadata = await sharpObj.metadata();
    let uploadResponse: any;
    let uploadResult: any | ImageUploadFailureResult | ImageUploadSuccessResult;
    const isImage = this.isFileAnImage(fileName, fileMetadata);
    if (true === isImage) {
      uploadResponse = await this.streamUpload(createReadStream(fileBuffer));
      uploadResult = {
        fileName: fileName,
        id: uploadResponse.public_id,
        size: uploadResponse.bytes,
        url: uploadResponse.url,
      }
      if (this.shouldGenerateThumbnails(fileMetadata)) {
        const thumbNailSharpObj = sharp(fileBuffer);
        for (const width of this.thmbnailWidths) {
          const resizeOp = thumbNailSharpObj.resize(width);
          uploadResponse = await this.streamUpload(resizeOp, true);
          const thumbnailRes: ImageUploadSuccessResult = {
            fileName: fileName,
            id: uploadResponse.public_id,
            size: uploadResponse.bytes,
            url: uploadResponse.url,
          }

          uploadResult.thumbnails = !!uploadResult.thumbnails ? [...uploadResult.thumbnails, thumbnailRes] : [thumbnailRes];
        }
      } else {
        uploadResult.thumbnails = [Object.assign({}, uploadResult)];
      }
    } else {
      uploadResult = isImage;
    }

    return { success: true === isImage, uploadResult };
  }


  async upload(file: Express.Multer.File) {
    const uploadResults: ImageUploadResult = { success: [], failed: [] };
    let uploadResponse: any;
    let sharpObj: sharp.Sharp;

    if (file.mimetype == "application/zip") {
      await JSZip.loadAsync(file.buffer).then(async (zip) => {
        const allFiles = zip.files;
        let file: JSZip.JSZipObject;
        let fileBuffer: Buffer;

        for (const filePointer in allFiles) {
          file = allFiles[filePointer];
          fileBuffer = await this.streamToBuffer(file.nodeStream());

          uploadResponse = await this.processUpload(fileBuffer, file.name);

          if (uploadResponse.sucess) {
            uploadResults.success.push(uploadResponse.uploadResult);
          } else {
            uploadResults.failed.push(uploadResponse.uploadResult);
          }
        }
      });
    } else {
      uploadResponse = await this.processUpload(file.buffer, file.originalname)
      
      if (uploadResponse.success) {
        uploadResults.success.push(uploadResponse.uploadResult);
      } else {
        uploadResults.failed.push(uploadResponse.uploadResult);
      }
    }

    return uploadResults;
  }

  private streamUpload(stream: NodeJS.ReadableStream, isThumbnail = false) {
    const folderPath = isThumbnail ? 'ImageProcessingAPI/thumbnails' : 'ImageProcessingAPI';
    return new Promise((resolve, reject) => {
      let streamUpload = cloudinary.uploader.upload_stream({ folder: folderPath, },
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

  private isFileAnImage = (fileName: string, fileMetadata: sharp.Metadata): ImageUploadFailureResult | boolean => {
    if (!fileMetadata.format) {
      return { file: fileName, reason: 'FileType cannot be determined' };
    } else if (!this.acceptedFileExtensions.includes(fileMetadata.format)) {
      return { file: fileName, reason: `File with extension ${fileMetadata.format} are not accepted but, Nice Try tho. :)` }
    }

    return true;
  }

  private shouldGenerateThumbnails = (fileMetadata: sharp.Metadata) => {
    return fileMetadata.width > 128 && fileMetadata.height > 128;
  }

  private streamToBuffer = async (stream: NodeJS.ReadableStream): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const buffers = [];
      stream.on("data", function (data) {
        buffers.push(data);
      });

      stream.on("end", function () {
        resolve(Buffer.concat(buffers));
      })
    });
  }
}