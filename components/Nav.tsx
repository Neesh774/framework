import {
  Box,
  Button,
  DarkMode,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  LightMode,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Switch,
  Tooltip,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Nav({
  showRounds,
  setShowRounds,
}: {
  showRounds: boolean;
  setShowRounds: (showRounds: boolean) => void;
}) {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const session = useSession();
  const toast = useToast();
  const supabase = useSupabaseClient();

  return (
    <Flex width="full" paddingX="8" paddingY="2" justifyContent="space-between">
      <Flex direction="row" gap="12" alignItems="center">
        <Stack direction="row">
          <Image src="/favicon.svg" alt="Logo" width="32" height="32" />
          <Heading pointerEvents="none" userSelect="none">
            Framework
          </Heading>
        </Stack>
        <Stack direction="row">
          {session && (
            <Link href="/">
              <Button colorScheme="purple" variant="ghost">
                <Heading size="md" colorScheme="purple">
                  All Cases
                </Heading>
              </Button>
            </Link>
          )}
        </Stack>
      </Flex>
      <Flex alignItems="center" direction="row" gap="2">
        {session && router.asPath != "/" && (
          <>
            <FormLabel htmlFor="showRounds" marginBottom="0">
              Round View
            </FormLabel>
            <Switch
              size="md"
              isChecked={showRounds}
              onChange={(e) => setShowRounds(e.target.checked)}
              colorScheme="purple"
            />
          </>
        )}
        <IconButton
          variant="ghost"
          aria-label="Toggle dark mode"
          onClick={toggleColorMode}
          icon={colorMode === "dark" ? <Sun /> : <Moon />}
        />
        {session && (
          <Menu>
            <MenuButton>
              <Box rounded="full" width="fit" height="fit" overflow="hidden">
                <Image
                  src={session.user.user_metadata["avatar_url"]}
                  alt="Avatar"
                  width="32"
                  height="32"
                />
              </Box>
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  router.push("/");
                }}
              >
                All Cases
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();
                  if (error) {
                    toast({
                      title: "Error signing out.",
                      status: "error",
                      duration: 2000,
                    });
                  } else {
                    toast({
                      title: "Signed out!",
                      status: "success",
                      duration: 2000,
                    });
                    router.push("/");
                  }
                }}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Flex>
  );
}
