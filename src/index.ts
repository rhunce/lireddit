import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import RedisStore from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

export const appDataSource = new DataSource({
  type: "postgres",
  database: "lireddit2",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, User],
});

const main = async () => {
  appDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  const app = express();

  // REDIS CONNECTION (for session authentication)
  // Initialize Redis client.
  const redis = new Redis();
  redis.connect().catch(console.error);

  // Initialize Redis store.
  const redisStore = new RedisStore({
    client: redis,
    disableTouch: true,
  });

  // MIDDLEWARE
  app.use(
    cors({
      origin: "http://localhost:3001",
      credentials: true,
    })
  );

  // Initialize Redis session storage.
  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true, // can't access cookie in frontend javascript code
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https if true
      },
      saveUninitialized: false, // recommended: only save session when data exists
      secret: "hvfxdhxchjkbouyfirtyuhkbl",
      resave: false, // required: force lightweight session keep alive (touch)
    })
  );

  // DATABASE CONNECTION
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext): MyContext => ({
      req,
      res,
      redis,
    }),
    // TODO: This plugin is deprecated. Implement non-deprecated solution.
    // Stack Overflow where this plugin solution came from and where non-deprecated solutions are referenced:
    // https://stackoverflow.com/questions/69333408/express-session-does-not-set-cookie
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(3000, () => console.log("Listening on localhost:3000"));
};

main().catch((err) => {
  console.error(err);
});
