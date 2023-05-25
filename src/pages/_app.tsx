import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

// NOTE: Example of Urql Graphcache Cache Update feature (not needed at the moment)
// import {
//   QueryInput, cacheExchange, Cache,
// } from "@urql/exchange-graphcache";
// import {
//   LoginMutation,
//   MeDocument,
//   MeQuery,
//   RegisterMutation,
// } from "../generated/graphql";

// function betterUpdateQuery<Result, Query>(
//   cache: Cache,
//   qi: QueryInput,
//   result: any,
//   fn: (r: Result, q: Query) => Query
// ) {
//   return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
// }

const client = new Client({
  url: "http://localhost:3000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [cacheExchange, fetchExchange],
  // NOTE: Example of Urql Graphcache Cache Update feature (not needed at the moment)
  // exchanges: [
  //   cacheExchange({
  //     updates: {
  //       Mutation: {
  //         login: (res, _args, cache, _info) => {
  //           betterUpdateQuery<LoginMutation, MeQuery>(
  //             cache,
  //             { query: MeDocument },
  //             res,
  //             (result, query) => {
  //               if (result.login.errors) {
  //                 return query;
  //               } else {
  //                 return {
  //                   me: result.login.user,
  //                 };
  //               }
  //             }
  //           );
  //         },
  //         register: (res, _args, cache, _info) => {
  //           betterUpdateQuery<RegisterMutation, MeQuery>(
  //             cache,
  //             { query: MeDocument },
  //             res,
  //             (result, query) => {
  //               if (result.register.errors) {
  //                 return query;
  //               } else {
  //                 return {
  //                   me: result.register.user,
  //                 };
  //               }
  //             }
  //           );
  //         },
  //       },
  //     },
  //   }),
  //   fetchExchange,
  // ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
