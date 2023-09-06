import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { DarkModeToggle } from "./DarkModeToggle";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const [pause, setPause] = React.useState(true);

  const [{ data, fetching }] = useMeQuery({
    pause,
  });
  let body;

  React.useEffect(() => {
    setPause(isServer());
  }, []);

  // data is loading
  if (fetching) {
    body = null;

    // user not logged in
  } else if (!data?.me) {
    body = (
      <Flex align="center">
        <Link as={NextLink} href="/login" mr={2}>
          Login
        </Link>
        <Link as={NextLink} href="/register">
          Register
        </Link>
        <DarkModeToggle />
      </Flex>
    );

    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <Link as={NextLink} mr={2} href="/create-post">
          <Button mr={4}>Create Post</Button>
        </Link>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout({});
            router.reload();
          }}
          isLoading={logoutFetching}
          variant={"link"}
        >
          Logout
        </Button>
        <DarkModeToggle />
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <Link as={NextLink} href="/">
          <Heading>Raddit</Heading>
        </Link>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
