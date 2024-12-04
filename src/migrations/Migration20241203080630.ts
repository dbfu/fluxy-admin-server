import { Migration } from '@mikro-orm/migrations';

export class Migration20241203080630 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'create table `sys_menu_roles` (`menu_entity_id` bigint unsigned not null, `role_entity_id` bigint unsigned not null, primary key (`menu_entity_id`, `role_entity_id`)) default character set utf8mb4 engine = InnoDB;'
    );
    this.addSql(
      'alter table `sys_menu_roles` add index `sys_menu_roles_menu_entity_id_index`(`menu_entity_id`);'
    );
    this.addSql(
      'alter table `sys_menu_roles` add index `sys_menu_roles_role_entity_id_index`(`role_entity_id`);'
    );

    this.addSql(
      'alter table `sys_menu_roles` add constraint `sys_menu_roles_menu_entity_id_foreign` foreign key (`menu_entity_id`) references `sys_menu` (`id`) on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table `sys_menu_roles` add constraint `sys_menu_roles_role_entity_id_foreign` foreign key (`role_entity_id`) references `sys_role` (`id`) on update cascade on delete cascade;'
    );
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists `sys_menu_roles`;');
  }
}
