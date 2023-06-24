import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1687610837273 implements MigrationInterface {
  name = 'Migration1687610837273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` CHANGE `id` `id` int NOT NULL COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `id`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `id` bigint NOT NULL PRIMARY KEY COMMENT '主键'"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_file` CHANGE `id` `id` int NOT NULL COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_file` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `sys_file` DROP COLUMN `id`');
    await queryRunner.query(
      "ALTER TABLE `sys_file` ADD `id` bigint NOT NULL PRIMARY KEY COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_file` DROP COLUMN `pkValue`');
    await queryRunner.query(
      "ALTER TABLE `sys_file` ADD `pkValue` varchar(255) NULL COMMENT '外健值'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `sys_file` DROP COLUMN `pkValue`');
    await queryRunner.query(
      "ALTER TABLE `sys_file` ADD `pkValue` int NULL COMMENT '外健值'"
    );
    await queryRunner.query('ALTER TABLE `sys_file` DROP COLUMN `id`');
    await queryRunner.query(
      "ALTER TABLE `sys_file` ADD `id` int NOT NULL AUTO_INCREMENT COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_file` ADD PRIMARY KEY (`id`)');
    await queryRunner.query(
      "ALTER TABLE `sys_file` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `id`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `id` int NOT NULL AUTO_INCREMENT COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` ADD PRIMARY KEY (`id`)');
    await queryRunner.query(
      "ALTER TABLE `sys_user` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
  }
}
