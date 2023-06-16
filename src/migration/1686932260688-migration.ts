import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1686932260688 implements MigrationInterface {
  name = 'Migration1686932260688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `name` varchar(255) NOT NULL COMMENT '测试字段'"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `name1` varchar(255) NOT NULL COMMENT '测试字段1'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `avatar` varchar(255) NULL COMMENT '头像'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `avatar` int NULL COMMENT '头像'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `avatar` varchar(255) NULL COMMENT '头像'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `avatar` int NULL COMMENT '头像'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `name1`');
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `name`');
  }
}
