import express from 'express';
import { IExpressWithJson, JsonErrorResponse } from 'express-with-json/dist';

import container from '../service-container/inversify.config';

import { Image } from '../models';
import { ServiceInterfaceTypes } from '../service-container/ServiceTypes';
import { ImageServiceInterface } from '../services';

var imageService = container.get<ImageServiceInterface>(ServiceInterfaceTypes.ServiceTypes.imageService);

export async function create(req: express.Request) {
  const image = new Image();
  

  return await imageService.create(image);
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

export default (app: IExpressWithJson) => {
  app.postJson('/images', create);
  app.deleteJson('/images/:id', remove);
  app.getJson('/images', getAll);
  app.getJson('/images/:id', get);
}