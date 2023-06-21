import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1687366030346 implements MigrationInterface {
  name = 'Migration1687366030346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `avatar` varchar(255) NULL COMMENT '头像'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `avatar` int NULL COMMENT '头像'"
    );
  }
}
