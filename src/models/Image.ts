import { AutoMap } from "@nartc/automapper";
import { IdentityModel } from "./common/IdentityModel";

export class Image extends IdentityModel {
    @AutoMap() name: string;

    @AutoMap() title: string;

    @AutoMap() description: string;

    @AutoMap() size: string;
}