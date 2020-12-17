import express from 'express';
import { IExpressWithJson, JsonErrorResponse } from 'express-with-json/dist';
import { body, validationResult } from 'express-validator';


import container from '../service-container/inversify.config';

import { Image } from '../models';
import { ServiceInterfaceTypes } from '../service-container/ServiceTypes';
import { ImageServiceInterface } from '../services';
import { uploadMiddleWare } from '../middlewares/UploadMiddleware';

var imageService = container.get<ImageServiceInterface>(ServiceInterfaceTypes.ServiceTypes.imageService);

export async function create(req: any) {
  try {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new JsonErrorResponse({ errors: errors.array() });
  }

    const { title, description } = req.body;

    if (req.file && req.file.path) {
      const image = new Image();
      image.name = req.file.filename;
      image.size = req.file.size;
      image.title = title;
      image.description = description;

      await imageService.create(image);

      return { message: 'Image Uploaded Successfully', url: req.file.path }
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

const midd = [uploadMiddleWare.single('picture'), body('description').notEmpty()];

export default (app: IExpressWithJson) => {
  app.postJson('/images', ...midd, create);
  app.deleteJson('/images/:id', remove);
  app.getJson('/images', getAll);
  app.getJson('/images/:id', get);
}