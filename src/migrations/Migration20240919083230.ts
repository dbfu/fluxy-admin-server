import { Migration } from '@mikro-orm/migrations';

export class Migration20240919083230 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'alter table `sys_user` add constraint `sys_user_avatar_id_foreign` foreign key (`avatar_id`) references `sys_file` (`id`) on update cascade;'
    );
    this.addSql(
      'alter table `sys_user` add unique `sys_user_avatar_id_unique`(`avatar_id`);'
    );

    this.addSql(
      'alter table `sys_role_users` add constraint `sys_role_users_user_entity_id_foreign` foreign key (`user_entity_id`) references `sys_user` (`id`) on update cascade on delete cascade;'
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      'alter table `sys_role_users` drop foreign key `sys_role_users_user_entity_id_foreign`;'
    );

    this.addSql(
      'alter table `sys_user` drop foreign key `sys_user_avatar_id_foreign`;'
    );

    this.addSql(
      'alter table `sys_user` drop index `sys_user_avatar_id_unique`;'
    );
  }
}
