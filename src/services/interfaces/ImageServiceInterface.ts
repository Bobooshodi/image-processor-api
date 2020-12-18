import {getCustomRepository} from "typeorm";

import { AbstractInterface } from "./common/AbstractInterface";
import { Image } from "../../models";

export interface ImageServiceInterface extends AbstractInterface<Image> {
    createAndSave(file: Express.Multer.File, description?: string): Promise<any>;
}