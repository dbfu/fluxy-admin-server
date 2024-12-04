import { Migration } from '@mikro-orm/migrations';

export class Migration20240919083754 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'alter table `sys_user` add index `sys_user_avatar_id_index`(`avatar_id`);'
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      'alter table `sys_user` add unique `sys_user_avatar_id_unique`(`avatar_id`);'
    );
  }
}
