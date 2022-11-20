import {
  Accordion,
  AccordionItem,
  Center,
  Container,
  Divider,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Spinner,
  Stack,
  Switch,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Contentions from "../components/Contentions";
import Definitions from "../components/Definitions";
import Framework from "../components/Framework";
import MetaTags from "../components/MetaTags";
import RoundsMenu from "../components/RoundsMenu";
import formatDate from "../utils/formatDate";
import { Case, Case as CaseType, Round } from "../utils/interfaces";

export default function CasePage({ showRounds }: { showRounds: boolean }) {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const toast = useToast();
  const [caseData, setCase] = useState<CaseType | undefined>(undefined);
  const [side, setSide] = useState<"gov" | "opp">("gov");

  useEffect(() => {
    const id = router.query.id;
    if (!id) {
      router.push("/");
      return;
    }
    const fetchCase = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        console.log(error);
      }
      if (data) {
        setCase(data);
      }
    };
    fetchCase();
  }, [router, supabase]);
  return (
    <Stack width="full" px="8" py="4">
      <MetaTags title="Your Cases" />
      {caseData ? (
        <Flex dir="row" gap="4">
          <Container>
            <Stack dir="column" gap="1" marginBottom="3">
              <Input
                variant="unstyled"
                fontSize="3xl"
                fontWeight="bold"
                value={caseData.resolved}
                onChange={(e) => {
                  setCase({
                    ...caseData,
                    resolved: e.target.value,
                  });
                }}
                onBlur={async () => {
                  const { error } = await supabase
                    .from("cases")
                    .update({ resolved: caseData.resolved })
                    .eq("id", caseData.id);
                  if (error) {
                    toast({
                      title: "Error updating resolved.",
                      status: "error",
                      duration: 5000,
                    });
                  }
                }}
              />
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size="xs" color="purple.400">
                  {formatDate(new Date(caseData.created_at))}
                </Heading>
                <Stack direction="row">
                  <FormLabel
                    htmlFor="side"
                    marginBottom="0"
                    color={side === "gov" ? "green.400" : "red.400"}
                    fontSize="sm"
                  >
                    {side === "gov" ? "Gov" : "Opp"}
                  </FormLabel>
                  <Switch
                    colorScheme="purple"
                    isChecked={side === "opp"}
                    onChange={() => setSide(side === "gov" ? "opp" : "gov")}
                  />
                </Stack>
              </Flex>
            </Stack>
            <Divider />
            <Stack dir="column" my="2" gap="2">
              <Framework
                framework={caseData.framework}
                setFramework={(framework: Case["framework"]) => {
                  setCase({
                    ...caseData,
                    framework,
                  });
                }}
                updateFramework={async (framework: Case["framework"]) => {
                  const { error } = await supabase
                    .from("cases")
                    .update({ framework })
                    .eq("id", caseData.id);
                  if (error) {
                    toast({
                      title: "Error updating framework.",
                      status: "error",
                      duration: 5000,
                    });
                  }
                }}
                side={side}
                setSide={setSide}
              />
              <Definitions
                definitions={caseData.definitions}
                setDefinitions={(definitions: Case["definitions"]) => {
                  setCase({
                    ...caseData,
                    definitions,
                  });
                }}
                updateDefinitions={async (definitions: Case["definitions"]) => {
                  const { error } = await supabase
                    .from("cases")
                    .update({ definitions })
                    .eq("id", caseData.id);
                  if (error) {
                    toast({
                      title: "Error updating case.",
                      status: "error",
                      duration: 3000,
                    });
                  }
                }}
                side={side}
                setSide={setSide}
              />
              <Contentions
                contentions={caseData.contentions}
                setContentions={(contentions: Case["contentions"]) => {
                  setCase({
                    ...caseData,
                    contentions,
                  });
                }}
                updateContentions={async (contentions: Case["contentions"]) => {
                  const { error } = await supabase
                    .from("cases")
                    .update({ contentions })
                    .eq("id", caseData.id);
                  if (error) {
                    toast({
                      title: "Error updating case.",
                      status: "error",
                      duration: 3000,
                    });
                  }
                }}
                side={side}
                setSide={setSide}
              />
            </Stack>
          </Container>
          {showRounds && (
            <RoundsMenu
              rounds={caseData.rounds}
              setRounds={(rounds: Round[]) => {
                setCase({
                  ...caseData,
                  rounds,
                });
              }}
              updateRounds={async (rounds: Round[]) => {
                const { error } = await supabase
                  .from("cases")
                  .update({ rounds })
                  .eq("id", caseData.id);
                if (error) {
                  toast({
                    title: "Error updating case.",
                    status: "error",
                    duration: 3000,
                  });
                }
              }}
            />
          )}
        </Flex>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </Stack>
  );
}
