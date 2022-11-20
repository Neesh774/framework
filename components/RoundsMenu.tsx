import {
  Container,
  Flex,
  Accordion,
  AccordionItem,
  useColorModeValue,
  IconButton,
  Heading,
  Center,
  AccordionPanel,
  AccordionButton,
  Stack,
  Switch,
  FormLabel,
} from "@chakra-ui/react";
import { Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { Case, Round } from "../utils/interfaces";
import Contentions from "./Contentions";
import Definition from "./Definitions";
import { RichEditor } from "./Editor";
import Framework from "./Framework";

export default function RoundsMenu({
  rounds,
  setRounds,
  updateRounds,
}: {
  rounds: Round[];
  setRounds: (rounds: Round[]) => void;
  updateRounds: (rounds: Round[]) => void;
}) {
  const bg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    updateRounds(rounds);
  }, [rounds, updateRounds]);

  return (
    <Container bg={bg} borderRadius="lg" padding="4">
      <Flex dir="row" mb="2">
        <Heading size="md">Rounds</Heading>
        <IconButton
          icon={<Plus />}
          aria-label="Add round"
          variant="ghost"
          size="sm"
          ml="auto"
          onClick={() => {
            setRounds([
              ...rounds,
              {
                round: rounds.length + 1,
                side: "gov",
                opponent_contentions: [],
                opponent_definitions: [],
                opponent_framework: "",
                notes: "",
              },
            ]);
          }}
        />
      </Flex>
      {rounds.length > 0 ? (
        <Accordion allowToggle>
          {rounds.map((round, i) => (
            <AccordionItem key={i}>
              <h3>
                <AccordionButton>
                  <Heading size="md">Round {round.round}</Heading>
                </AccordionButton>
              </h3>
              <AccordionPanel>
                <Stack>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="sm">Opponent</Heading>
                    <Flex dir="row" gap="2">
                      <Flex alignItems="center">
                        <span>{round.side == "gov" ? "Gov" : "Opp"}</span>
                        <Switch
                          colorScheme="purple"
                          ml="2"
                          isChecked={round.side == "opp"}
                          onChange={() => {
                            const newRounds = [...rounds];
                            newRounds[i].side =
                              round.side == "gov" ? "opp" : "gov";
                            setRounds(newRounds);
                          }}
                        />
                      </Flex>
                      <IconButton
                        icon={<Trash />}
                        aria-label="Delete round"
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                        onClick={() => {
                          const newRounds = [...rounds];
                          newRounds.splice(i, 1);
                          setRounds(newRounds);
                        }}
                      />
                    </Flex>
                  </Flex>
                  <Framework
                    framework={
                      {
                        [round.side]: round.opponent_framework,
                        [round.side == "gov" ? "opp" : "gov"]: "",
                      } as Case["framework"]
                    }
                    setFramework={(framework) => {
                      const newRounds = [...rounds];
                      newRounds[i].opponent_framework = framework[round.side];
                      setRounds(newRounds);
                    }}
                    updateFramework={(framework) => {
                      const newRounds = [...rounds];
                      newRounds[i].opponent_framework = framework[round.side];
                      updateRounds(newRounds);
                    }}
                    side={round.side}
                    setSide={() => {}}
                    oneSided
                  />
                  <Contentions
                    contentions={
                      {
                        [round.side]: round.opponent_contentions,
                        [round.side == "gov" ? "opp" : "gov"]: [],
                      } as Case["contentions"]
                    }
                    setContentions={(contentions) => {
                      const newRounds = [...rounds];
                      newRounds[i].opponent_contentions =
                        contentions[round.side];
                      setRounds(newRounds);
                    }}
                    updateContentions={(contentions) => {
                      const newRounds = [...rounds];
                      newRounds[i].opponent_contentions =
                        contentions[round.side];
                      updateRounds(newRounds);
                    }}
                    side={round.side}
                    setSide={() => {}}
                    oneSided
                  />
                  <RichEditor
                    placeholder="Notes"
                    value={round.notes}
                    onChange={(value) => {
                      rounds[i].notes = value;
                      setRounds(rounds);
                    }}
                  />
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Center>
          <Heading size="sm" color="gray.500">
            No rounds
          </Heading>
        </Center>
      )}
    </Container>
  );
}
