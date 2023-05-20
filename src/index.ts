import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();
  const fork = orm.em.fork();

  const app = express();

  // REDIS CONNECTION (for session authentication)
  // Initialize Redis client.
  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  // Initialize Redis store.
  const redisStore = new RedisStore({
    client: redisClient,
    disableTouch: true,
  });

  // MIDDLEWARE
  // Initialize Redis session storage.
  app.use(
    session({
      name: "qid",
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
    context: ({ req, res }: MyContext): MyContext => ({ em: fork, req, res }),
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
  apolloServer.applyMiddleware({ app });

  app.listen(3000, () => console.log("Listening on localhost:3000"));
};

main().catch((err) => {
  console.error(err);
});
