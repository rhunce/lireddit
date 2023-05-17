import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Ctx() { em }: MyContext,
    @Arg("id") id: number
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Ctx() { em }: MyContext,
    @Arg("title") title: string
  ): Promise<Post> {
    const newPost = em.create(Post, { title });
    await em.persistAndFlush(newPost);
    return newPost;
  }
}
