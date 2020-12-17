import { Column, Entity } from 'typeorm';
import { IdentityEntity } from './common/IdentityEntity';

@Entity()
export class Image extends IdentityEntity {
    @Column({type: 'varchar', unique: true, nullable: false})
    name: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'varchar', nullable: true })
    description: string;

    @Column({ type: 'varchar', nullable: false })
    size: string;
}