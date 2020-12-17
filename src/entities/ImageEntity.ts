import { Column, Entity } from 'typeorm';
import { IdentityEntity } from './common/IdentityEntity';

@Entity({name: "images"})
export class ImageEntity extends IdentityEntity {
    @Column({type: 'varchar', unique: true, nullable: false})
    name: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'varchar', nullable: true })
    description: string;

    @Column({ type: 'varchar', nullable: false })
    size: string;
}