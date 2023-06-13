import { fetchExchange, mapExchange, stringifyVariables } from "urql";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
} from "../generated/graphql";
import { Resolver, cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import Router from "next/router";

// NOTE: Modified for cursor-based pagination from simplePagination at
// https://github.com/urql-graphql/urql/blob/main/exchanges/graphcache/src/extras/simplePagination.ts
const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:3000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          createPost: (_mutationResult, _args, cache, _info) => {
            const allFields = cache.inspectFields("Query");
            const fieldInfos = allFields.filter(
              (info) => info.fieldName === "posts"
            );
            fieldInfos.forEach((fi) => {
              cache.invalidate("Query", "posts", fi.arguments || {});
            });
          },
          login: (mutationResult, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              mutationResult,
              (mutResult, query) => {
                if (mutResult.login.errors) {
                  return query;
                } else {
                  return {
                    me: mutResult.login.user,
                  };
                }
              }
            );
          },
          register: (mutationResult, _args, cache, _info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              mutationResult,
              (mutResult, query) => {
                if (mutResult.register.errors) {
                  return query;
                } else {
                  return {
                    me: mutResult.register.user,
                  };
                }
              }
            );
          },
          logout: (mutationResult, _args, cache, _info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              mutationResult,
              () => ({ me: null })
            );
          },
        },
      },
    }),
    ssrExchange,
    mapExchange({
      onError(error) {
        if (error?.message.toLowerCase().includes("not authenticated")) {
          // NOTE: Since not in a React Component, using alternative to useRouter hook
          Router.replace("/login");
        }
      },
    }),
    fetchExchange,
  ],
});
