import express from 'express';
import { IExpressWithJson, JsonErrorResponse } from 'express-with-json/dist';
import { validationResult } from 'express-validator';
import multer from 'multer';

import container from '../service-container/inversify.config';

import { ServiceInterfaceTypes } from '../service-container/ServiceTypes';
import { ImageServiceInterface } from '../services';


var uploadMiddleWare = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/zip") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only Images (.png, .jpg and .jpeg) or ZIP (.zip) files are allowed!'));
    }
  }
});
var imageService = container.get<ImageServiceInterface>(ServiceInterfaceTypes.ServiceTypes.imageService);

export async function create(req: any) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new JsonErrorResponse({ errors: errors.array() });
    }

    const { description } = req.body;

    if (req.file) {      
      const uploadDetails = await imageService.createAndSave(req.file, description);

      return { message: 'Images Uploaded Successfully', details: uploadDetails }
    } else {
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