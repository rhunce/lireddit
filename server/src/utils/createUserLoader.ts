import DataLoader from "dataloader";
import { User } from "../entities/User";
import { In } from "typeorm";

// NOTE: Basic gist of dataloader is to
// - create a loader
// - define how to batch all the calls into a single SQL statement
// - return the data in an order that matches the order of the keys
// - pass into context
// - then resolvers can access it

// userIds: an array of numbers, i.e. User IDs [1, 78, 8, 9]
// return: User for each ID [{User 1}, {User 78}, ... ]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIDs) => {
    const users = await User.findBy({ id: In(userIDs as number[]) });
    const userIdToUser: Record<number, User> = {};
    users.forEach((user) => {
      userIdToUser[user.id] = user;
    });

    return userIDs.map((userId) => userIdToUser[userId]);
  });
