import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql"

@ObjectType()
@Entity()
export class User {
  @Field({ description:"ID of User." })
  @PrimaryKey()
  id!: number;

  @Field(() => String, { description:"When User was created." })
  @Property({ type: "date" })
  createdAt?: Date = new Date();

  @Field(() => String, { description:"When User was updated." })
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Field({ description: "Username of User." }) 
  @Property({ type: "text", unique: true })
  username!: string;

  @Property({ type: "text" })
  password!: string;
}