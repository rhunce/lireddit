import { fetchExchange, mapExchange } from "urql";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
} from "../generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import Router from "next/router";

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:3000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    cacheExchange({
      updates: {
        Mutation: {
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
