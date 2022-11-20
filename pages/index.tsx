import {
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import MetaTags from "../components/MetaTags";
import formatDate from "../utils/formatDate";
import { Case } from "../utils/interfaces";

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [userCases, setUserCases] = useState<Case[] | undefined>(undefined);
  const toast = useToast();

  const card = useColorModeValue("white", "gray.700");
  const hoverCard = useColorModeValue("gray.100", "gray.600");

  const fetchCases = useCallback(async () => {
    if (!session) return;
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) return;
    const { data, error, status } = await supabase
      .from("cases")
      .select()
      .eq("userId", user.user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast({
        title: "Error fetching cases.",
        status: "error",
        duration: 5000,
      });
    }
    if (data) {
      setUserCases(data);
    }
  }, [session, supabase, toast]);

  useEffect(() => {
    if (!session) {
      router.push("/auth?redirect=/");
    } else {
      fetchCases();
    }
  }, [session, router, supabase, fetchCases]);

  return (
    <Stack width="full">
      <MetaTags title="Your Cases" />
      <Container>
        <Flex
          marginBottom="2"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size="lg">Your Cases</Heading>
          <IconButton
            icon={<Plus />}
            variant="ghost"
            aria-label="Create a new case"
            onClick={async () => {
              const { data: newPage, error } = (await supabase
                .from("cases")
                .insert({
                  userId: session?.user?.id,
                  resolved: "Untitled Case",
                })
                .select()
                .single()) as { data: Case; error: any };
              if (error) {
                console.error(error);
                toast({
                  title: "Error creating case.",
                  status: "error",
                  duration: 5000,
                });
              }
              if (newPage != null) {
                router.push(`/${newPage.id}`);
              }
            }}
          />
        </Flex>
        <Divider />
        {userCases ? (
          <Stack>
            {userCases.map((userCase, i) => {
              const date = new Date(userCase.created_at);
              return (
                <Link href={`/${userCase.id}`} key={i}>
                  <Flex
                    dir="row"
                    justifyContent="space-between"
                    alignItems="center"
                    paddingX="2"
                    paddingY="4"
                    marginY="2"
                    borderRadius="lg"
                    borderWidth="1px"
                    backgroundColor={card}
                    transition="all 0.2s"
                    _hover={{
                      backgroundColor: hoverCard,
                    }}
                  >
                    <Heading size="md">{userCase.resolved}</Heading>
                    <Heading size="xs" color="purple.400">
                      {formatDate(date)}
                    </Heading>
                  </Flex>
                </Link>
              );
            })}
          </Stack>
        ) : (
          <Center>
            <Spinner />
            Loading your cases...
          </Center>
        )}
      </Container>
    </Stack>
  );
}
