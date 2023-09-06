import { Box, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

interface DarkModeToggleProps {}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box m={2}>
      {colorMode === "light" ? (
        <MoonIcon onClick={toggleColorMode} />
      ) : (
        <SunIcon onClick={toggleColorMode} />
      )}
    </Box>
  );
};
