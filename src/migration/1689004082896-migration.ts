import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1689004082896 implements MigrationInterface {
  name = 'Migration1689004082896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `sys_menu` ADD `authCode` varchar(255) NOT NULL COMMENT '按钮权限代码'"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_menu` CHANGE `route` `route` varchar(255) NULL COMMENT '路由'"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_menu` CHANGE `orderNumber` `orderNumber` int NULL COMMENT '排序号'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `sys_menu` CHANGE `orderNumber` `orderNumber` int NOT NULL COMMENT '排序号'"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_menu` CHANGE `route` `route` varchar(255) NOT NULL COMMENT '路由'"
    );
    await queryRunner.query('ALTER TABLE `sys_menu` DROP COLUMN `authCode`');
  }
}
