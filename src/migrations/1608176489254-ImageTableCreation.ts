import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageTableCreation1608176489254 implements MigrationInterface {
    name = 'ImageTableCreation1608176489254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `image` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `dateCreated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `dateUpdated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` varchar(255) NULL, `size` varchar(255) NOT NULL, UNIQUE INDEX `IDX_e4dfc6a6f95452c9c931f5df48` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_e4dfc6a6f95452c9c931f5df48` ON `image`");
        await queryRunner.query("DROP TABLE `image`");
    }

}
