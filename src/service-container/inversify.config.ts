import { Container } from "inversify";

import { ServiceInterfaceTypes } from "./ServiceTypes";
import { ImageServiceInterface, ImageService, ImageUploadService, ImageUploadServiceInterface } from "../services";

var container = new Container();
container.bind<ImageServiceInterface>(ServiceInterfaceTypes.ServiceTypes.imageService).to(ImageService);
container.bind<ImageUploadServiceInterface>(ServiceInterfaceTypes.ServiceTypes.imageUploadService).to(ImageUploadService);

export default container;