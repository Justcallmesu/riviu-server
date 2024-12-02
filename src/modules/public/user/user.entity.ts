import { BaseModel } from '@/modules/common/model/base-model';
import { compare, genSalt, hash } from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseModel {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, select: false })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    const salt = await genSalt(10);

    if (!this.password) return;

    this.password = await hash(this.password, salt);
  }

  async comparePassword(candidate: string) {
    return await compare(candidate, this.password);
  }
}
