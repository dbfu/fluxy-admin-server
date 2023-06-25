import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1686884629903 implements MigrationInterface {
  name = 'Migration1686884629903';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `sys_user` (`id` int NOT NULL AUTO_INCREMENT COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userName` varchar(255) NOT NULL COMMENT '用户名称', `nickName` varchar(255) NOT NULL COMMENT '用户昵称', `phoneNumber` varchar(255) NOT NULL COMMENT '手机号', `email` varchar(255) NOT NULL COMMENT '邮箱', `avatar` varchar(255) NULL COMMENT '头像', `sex` int NULL COMMENT '性别（0:女，1:男）', `password` varchar(255) NOT NULL COMMENT '密码', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `sys_file` (`id` int NOT NULL AUTO_INCREMENT COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `fileName` varchar(255) NOT NULL COMMENT '文件名', `filePath` varchar(255) NOT NULL COMMENT '文件路径', `pkName` varchar(255) NULL COMMENT '外健名称', `pkValue` int NULL COMMENT '外健值', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `avatar` int NULL COMMENT '头像'"
    );
    await queryRunner.query(
      "insert into `sys_user` (userName, nickName, password, phoneNumber, email, id) values ('admin', '管理员', '$2a$10$.OggYJaVe1OCLVSB/9wqk.bYYaSdvcHu7dcc0zpewfpzNKEDPh2Tu', '18222222222', 'admin@qq.com', '1')"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `sys_user` DROP COLUMN `avatar`');
    await queryRunner.query(
      "ALTER TABLE `sys_user` ADD `avatar` varchar(255) NULL COMMENT '头像'"
    );
    await queryRunner.query('DROP TABLE `sys_file`');
    await queryRunner.query('DROP TABLE `sys_user`');
  }
}
