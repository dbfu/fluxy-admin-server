import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1703083742862 implements MigrationInterface {
  name = 'Migration1703083742862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `sys_menu_version` (`id` bigint NOT NULL COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `menuId` varchar(255) NOT NULL COMMENT '菜单id', `version` varchar(255) NOT NULL COMMENT '版本号', `description` varchar(255) NOT NULL COMMENT '版本描述', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_menu` ADD `curVersion` varchar(255) NULL COMMENT '低代码页面当前版本号'"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_menu` CHANGE `type` `type` int NOT NULL COMMENT '类型，1:目录 2:菜单 3:按钮 4:低代码页面'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `sys_menu` CHANGE `type` `type` int NOT NULL COMMENT '类型，1:目录 2:菜单'"
    );
    await queryRunner.query('ALTER TABLE `sys_menu` DROP COLUMN `curVersion`');
    await queryRunner.query('DROP TABLE `sys_menu_version`');
  }
}
