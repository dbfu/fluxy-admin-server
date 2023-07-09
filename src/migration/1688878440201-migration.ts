import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1688878440201 implements MigrationInterface {
  name = 'Migration1688878440201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `sys_menu_interface` (`id` bigint NOT NULL COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `menuId` varchar(255) NOT NULL COMMENT '菜单id', `method` varchar(255) NOT NULL COMMENT '请求方式', `path` varchar(255) NOT NULL COMMENT 'path', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `sys_menu` (`id` bigint NOT NULL COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `parentId` varchar(255) NULL COMMENT '上级id', `name` varchar(255) NOT NULL COMMENT '名称', `icon` varchar(255) NULL COMMENT '图标', `type` int NOT NULL COMMENT '类型，1:目录 2:菜单', `route` varchar(255) NOT NULL COMMENT '路由', `filePath` varchar(255) NULL COMMENT '本地组件地址', `orderNumber` int NOT NULL COMMENT '排序号', `url` varchar(255) NULL COMMENT 'url', `show` tinyint NOT NULL COMMENT '是否在菜单中显示', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `sys_role_menu` (`id` bigint NOT NULL COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `roleId` varchar(255) NOT NULL COMMENT '角色id', `menuId` varchar(255) NOT NULL COMMENT '菜单id', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `sys_user_role` (`id` bigint NOT NULL COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` varchar(255) NOT NULL COMMENT '用户id', `roleId` varchar(255) NOT NULL COMMENT '角色id', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `sys_role` (`id` bigint NOT NULL COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL COMMENT '名称', `code` varchar(255) NOT NULL COMMENT '代码', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `avatar` varchar(255) NULL COMMENT '头像'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `id`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT '主键'"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_user` CHANGE `id` `id` int NOT NULL COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `id`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `id` bigint NOT NULL PRIMARY KEY COMMENT '主键'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `id`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `id` int NOT NULL AUTO_INCREMENT COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` ADD PRIMARY KEY (`id`)');
    await queryRunner.query(
      "ALTER TABLE `sys_user` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `id`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `id` bigint NOT NULL COMMENT '主键'"
    );
    await queryRunner.query('ALTER TABLE `sys_user` ADD PRIMARY KEY (`id`)');
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query('DROP TABLE `sys_role`');
    await queryRunner.query('DROP TABLE `sys_user_role`');
    await queryRunner.query('DROP TABLE `sys_role_menu`');
    await queryRunner.query('DROP TABLE `sys_menu`');
    await queryRunner.query('DROP TABLE `sys_menu_interface`');
  }
}
