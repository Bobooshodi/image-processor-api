import { Container } from "inversify";

import { ServiceInterfaceTypes } from "./ServiceTypes";
import { ImageServiceInterface, ImageService } from "../services";

import { ImageRepository, ImageRepositoryInterface } from "../repositories";
import { EntityManager } from "typeorm";


var container = new Container();
container.bind<ImageServiceInterface>(ServiceInterfaceTypes.ServiceTypes.imageService).to(ImageService);

export default container;