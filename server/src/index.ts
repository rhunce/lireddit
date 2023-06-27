import "reflect-metadata";
import "dotenv-safe/config";
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
import { Upvote } from "./entities/Upvote";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";

export const appDataSource = new DataSource({
  type: "postgres",
  // database: "lireddit2",
  // username: "postgres",
  // password: "postgres",
  // NOTE: url used in place of database, username, and password, above
  url: process.env.DATABASE_URL,
  logging: true,
  // synchronize: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, User, Upvote],
});

const main = async () => {
  appDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
      // appDataSource.runMigrations();
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  const app = express();

  // REDIS CONNECTION (for session authentication)
  // Initialize Redis client.
  const redis = new Redis(process.env.REDIS_URL);
  redis.connect().catch(console.error);

  // Initialize Redis store.
  const redisStore = new RedisStore({
    client: redis,
    disableTouch: true,
  });

  // MIDDLEWARE
  // NOTE: Tells Express we have 1 proxy sitting in front (NGINX, since Dokku is built on NGINX)
  // This way our cookies, sessions, etc..., will all still work in Production
  app.set("proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
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
        // NOTE: May experience cookie issues where during SSR, cookie not getting forwarded
        // To resolve, specify a domain and set up a custom domain
        // Replace codeponder with <my domain>
        // domain: __prod__ ? ".codeponder.com" : undefined,
      },
      saveUninitialized: false, // recommended: only save session when data exists
      secret: process.env.SESSION_SECRET,
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
      userLoader: createUserLoader(),
      upvoteLoader: createUpvoteLoader(),
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

  app.listen(parseInt(process.env.PORT), () =>
    console.log(`Listening on localhost:${process.env.PORT}`)
  );
};

main().catch((err) => {
  console.error(err);
});
