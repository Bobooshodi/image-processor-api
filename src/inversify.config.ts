import { Container } from "inversify";

import { ServiceInterfaceTypes } from "./service-container/ServiceTypes";
import { ImageServiceInterface, ImageService } from "./services";

import { ImageRepository, ImageRepositoryInterface } from "./repositories";


var container = new Container();
container.bind<ImageServiceInterface>(ServiceInterfaceTypes.ServiceTypes.imageService).to(ImageService);
container.bind<ImageRepositoryInterface>(ServiceInterfaceTypes.RepositoryTypes.ImageRepository).to(ImageRepository);

export default container;