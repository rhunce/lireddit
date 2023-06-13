import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field({ description: "ID of Post." })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ description: "Title of Post." })
  @Column()
  title!: string;

  @Field({ description: "Body of Post." })
  @Column()
  text!: string;

  @Field({ description: "Post total points (sum of upvotes and downvotes)." })
  @Column({ type: "integer", default: 0 })
  points!: number;

  @Field({ description: "ID of the User that created the Post." })
  @Column()
  creatorId: number;

  @Field({ description: "User that created the post." })
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Field(() => String, { description: "When Post was created." })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String, { description: "When Post was updated." })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Upvote, (upvote) => upvote.post)
  upvotes: Upvote[];
}
