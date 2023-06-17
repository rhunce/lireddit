import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useDeletePostMutation, usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { UpvoteSection } from "../components/UpvoteSection";
import { DeleteIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = React.useState({
    limit: 15,
    cursor: null as string | null,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  const [{}, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return (
      <div>
        You either have no posts or something went wrong with your query for
        some reason...
      </div>
    );
  }

  return (
    <Layout>
      {fetching && !data ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpvoteSection post={p} />
                <Box flex={1}>
                  <NextLink href={`/post/${p.id}`} passHref legacyBehavior>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by {p.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    <IconButton
                      ml="auto"
                      colorScheme="red"
                      icon={<DeleteIcon />}
                      aria-label="Delete Post"
                      onClick={() => {
                        deletePost({ id: p.id });
                      }}
                    ></IconButton>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load more...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
