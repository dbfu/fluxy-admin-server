import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1692155209836 implements MigrationInterface {
  name = 'Migration1692155209836';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `sys_menu_api` (`id` bigint NOT NULL COMMENT '主键', `createDate` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `menuId` varchar(255) NOT NULL COMMENT '菜单id', `method` varchar(255) NOT NULL COMMENT '请求方式', `path` varchar(255) NOT NULL COMMENT 'path', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      `CREATE TABLE \`casbin_rule\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`ptype\` varchar(255) DEFAULT NULL,
            \`v0\` varchar(255) DEFAULT NULL,
            \`v1\` varchar(255) DEFAULT NULL,
            \`v2\` varchar(255) DEFAULT NULL,
            \`v3\` varchar(255) DEFAULT NULL,
            \`v4\` varchar(255) DEFAULT NULL,
            \`v5\` varchar(255) DEFAULT NULL,
            \`v6\` varchar(255) DEFAULT NULL,
            PRIMARY KEY (\`id\`)
          ) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `sys_menu_api`');
    await queryRunner.query('DROP TABLE `casbin_rule`');
  }
}
