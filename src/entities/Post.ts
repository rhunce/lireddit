import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql"

@ObjectType()
@Entity()
export class Post {

  @Field({ description:"ID of Post." })
  @PrimaryKey()
  id!: number;

  @Field(() => String, { description:"When Post was created." })
  @Property({ type: "date" })
  createdAt?: Date = new Date();

  @Field(() => String, { description:"When Post was updated." })
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Field({ description: "Title of Post." }) 
  @Property({ type: "text" })
  title!: string;
}