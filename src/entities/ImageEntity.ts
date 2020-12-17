import { AutoMap } from '@nartc/automapper';
import { Column, Entity } from 'typeorm';
import { IdentityEntity } from './common/IdentityEntity';

@Entity({name: "images"})
export class ImageEntity extends IdentityEntity {
    @AutoMap()
    @Column({type: 'varchar', unique: true, nullable: false})
    name: string;

    @AutoMap()
    @Column({ type: 'varchar', nullable: false })
    title: string;

    @AutoMap()
    @Column({ type: 'varchar', nullable: true })
    description: string;

    @AutoMap()
    @Column({ type: 'varchar', nullable: false })
    size: string;
}