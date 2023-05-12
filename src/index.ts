import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();
  
//   const emFork = orm.em.fork(); // <-- create the fork
//   const post = emFork.create(Post, { // <-- use the fork instead of global `orm.em`
//     title: "my first post",
//   });
//   await emFork.persistAndFlush(post); // <-- use the fork instead of global

//   const posts = await emFork.find(Post, {});
//   console.log("POSTS") 
//   console.log(posts) 
};

main().catch((err) => {
  console.error(err);
});
