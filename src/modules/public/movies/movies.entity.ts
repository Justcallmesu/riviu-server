import { BaseModel } from '@/modules/common/model/base-model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Movies extends BaseModel {
  @Column()
  name: string;

  @Column()
  synopsis: string;

  @Column()
  image: string;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ type: 'datetime' })
  releaseDate: Date;

  @Column()
  youtubeLink: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User)
  author: User;

  @Column()
  authorReview: string;

  @Column({ type: 'integer' })
  rating: number;
}
