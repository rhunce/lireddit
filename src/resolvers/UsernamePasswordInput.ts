import { InputType, Field } from "type-graphql";

// NOTE: Alternative to using persistAndFlush
// import { EntityManager } from "@mikro-orm/postgresql";
@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}
