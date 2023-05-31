import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field({ description: "ID of Post." })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, { description: "When Post was created." })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String, { description: "When Post was updated." })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ description: "Title of Post." })
  @Column()
  title!: string;
}
