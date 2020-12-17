import { AutoMap } from '@nartc/automapper';
import { Column, CreateDateColumn, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class IdentityEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated("uuid")
    uuid: string;

    @AutoMap()
    @CreateDateColumn()
    dateCreated: Date;

    @AutoMap()
    @UpdateDateColumn()
    dateUpdated: Date;
}