import express from 'express';
import { IExpressWithJson, JsonErrorResponse } from 'express-with-json/dist';
import { body, validationResult } from 'express-validator';
import multer from 'multer';

import container from '../service-container/inversify.config';

import { Image } from '../models';
import { ServiceInterfaceTypes } from '../service-container/ServiceTypes';
import { ImageServiceInterface, ImageUploadServiceInterface } from '../services';


var uploadMiddleWare = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
var imageService = container.get<ImageServiceInterface>(ServiceInterfaceTypes.ServiceTypes.imageService);
var imageUploader = container.get<ImageUploadServiceInterface>(ServiceInterfaceTypes.ServiceTypes.imageUploadService);

export async function create(req: any) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new JsonErrorResponse({ errors: errors.array() });
    }

    const { title, description } = req.body;

    if (req.file) {
      const uploadedFile = await imageUploader.upload(req.file);

      const image = new Image();
      image.name = uploadedFile.id;
      image.size = uploadedFile.size;
      image.title = title;
      image.description = description;

      await imageService.create(image);

      return { message: 'Image Uploaded Successfully', url: uploadedFile.url }
    } else {
      console.log(req.file);
      throw new JsonErrorResponse({ error: 'invalid' }, { statusCode: 422 })
    }
  } catch (error) {
    console.error(error);
    throw new JsonErrorResponse({ error: "some error occured" });
  }


}

export async function remove(req: express.Request) {
  const { id } = req.params;

  const res = await imageService.delete(id);
  return { ok: res };
}

export async function get(req: express.Request) {
  const { id } = req.params;

  return await imageService.getById(id);
}

export async function getAll(req: express.Request) {
  return await imageService.getAll();
}

export async function update(req: express.Request) {
  const { id } = req.params;

  const existingImage = await imageService.getById(id);

  return await imageService.update(existingImage);
}

const midd = [uploadMiddleWare.single('picture')];

export default (app: IExpressWithJson) => {
  app.postJson('/images', ...midd, create);
  app.deleteJson('/images/:id', remove);
  app.getJson('/images', getAll);
  app.getJson('/images/:id', get);
}