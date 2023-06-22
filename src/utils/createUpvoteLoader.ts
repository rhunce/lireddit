import DataLoader from "dataloader";
import { In } from "typeorm";
import { Upvote } from "../entities/Upvote";

// NOTE: See createUserLoader.ts for more notes on dataloader
// keys: an array of objects, i.e. Post IDs and User IDs [{ postId: 5, userId: 10 }, ...]
// return: Upvote for each [{ postId: 5, userId: 10, value: 1 }, ...]
export const createUpvoteLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Upvote | null>(
    async (keys) => {
      const upvotes = await Upvote.findBy({
        userId: In(keys.map((key) => key.userId) as any),
        postId: In(keys.map((key) => key.postId) as any),
      });

      const upvotesIdsToUpvote: Record<string, Upvote> = {};
      upvotes.forEach((upvote) => {
        upvotesIdsToUpvote[`${upvote.userId}|${upvote.postId}`] = upvote;
      });

      return keys.map(
        (key) => upvotesIdsToUpvote[`${key.userId}|${key.postId}`]
      );
    }
  );
