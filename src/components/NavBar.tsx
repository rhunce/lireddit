import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  const [{ data, fetching }] = useMeQuery({
    pause: !isPageLoaded,
  });
  let body;

  React.useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // data is loading
  if (fetching) {
    body = null;

    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <Link href="/login" mr={2}>
          Login
        </Link>
        <Link href="/register">Register</Link>
      </>
    );

    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout({});
          }}
          isLoading={logoutFetching}
          variant={"link"}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tan" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
