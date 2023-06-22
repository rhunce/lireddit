import DataLoader from "dataloader";
import { User } from "../entities/User";
import { In } from "typeorm";

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
