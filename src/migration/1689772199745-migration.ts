import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1689772199745 implements MigrationInterface {
  name = 'Migration1689772199745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `sys_login_log` (`id` bigint NOT NULL COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userName` varchar(255) NOT NULL COMMENT '用户名', `ip` varchar(255) NOT NULL COMMENT '登录ip', `address` varchar(255) NOT NULL COMMENT '登录地点', `browser` varchar(255) NOT NULL COMMENT '浏览器', `os` varchar(255) NOT NULL COMMENT '操作系统', `status` tinyint NOT NULL COMMENT '登录状态', `message` varchar(255) NOT NULL COMMENT '登录消息', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `sys_menu` CHANGE `authCode` `authCode` varchar(255) NULL COMMENT '按钮权限代码'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `sys_menu` CHANGE `authCode` `authCode` varchar(255) NOT NULL COMMENT '按钮权限代码'"
    );
    await queryRunner.query('DROP TABLE `sys_login_log`');
  }
}
