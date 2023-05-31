import { ObjectType, Field } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field({ description: "ID of User." })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, { description: "When User was created." })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String, { description: "When User was updated." })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ description: "Username of User." })
  @Column({ unique: true })
  username!: string;

  @Field({ description: "Email address of User." })
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
