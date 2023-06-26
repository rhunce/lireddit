import { QueryInput, Cache } from "@urql/exchange-graphcache";

// Helper function to help cast the types for Mutation methods in cacheExchange
export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
