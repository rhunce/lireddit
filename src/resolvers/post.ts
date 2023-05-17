import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Resolver, Query, Ctx, Arg, Int } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Ctx() { em }: MyContext,
    @Arg("id", () => Int) id: number
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }
}
