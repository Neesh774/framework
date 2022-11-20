import * as React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import { Case } from "../utils/interfaces";
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Stack,
  Switch,
  useColorModeValue,
} from "@chakra-ui/react";
import { Plus, Trash } from "lucide-react";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const Definition = ({
  definitions,
  setDefinitions,
  updateDefinitions,
  side,
  setSide,
  oneSided,
}: {
  definitions: Case["definitions"];
  setDefinitions: (definitions: Case["definitions"]) => void;
  updateDefinitions: (definitions: Case["definitions"]) => void;
  side: "gov" | "opp";
  setSide: (side: "gov" | "opp") => void;
  oneSided?: boolean;
}) => {
  const [[page, direction], setPage] = useState<["gov" | "opp", number]>([
    side,
    0,
  ]);
  const bg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    setPage([side, "gov" ? -1 : 1]);
  }, [side]);

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <Container bg={bg} rounded="md" py="2" px="4" overflow="hidden">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <HStack>
                <Heading
                  color={page == "gov" ? "green.300" : "red.300"}
                  size="md"
                >
                  {page == "gov" ? "Gov" : "Opp"} Definitions
                </Heading>
                {!oneSided && (
                  <Switch
                    colorScheme="purple"
                    isChecked={page == "opp"}
                    onChange={() => setPage([page == "gov" ? "opp" : "gov", 1])}
                  />
                )}
              </HStack>
              <IconButton
                icon={<Plus />}
                aria-label="Add a new definition"
                variant="ghost"
                onClick={() => {
                  setDefinitions({
                    ...definitions,
                    [page]: [...definitions[page], ["", ""]],
                  });
                }}
              />
            </Flex>
            <Stack spacing="2" my="2">
              {definitions[page].length > 0 ? (
                definitions[page].map(([term, value], i) => (
                  <Flex key={i} gap="2" alignItems="center">
                    <Input
                      value={term}
                      onChange={(e) => {
                        const newDefinitions = definitions;
                        newDefinitions[page][i][0] = e.target.value;
                        setDefinitions(newDefinitions);
                      }}
                      onBlur={() => {
                        updateDefinitions(definitions);
                      }}
                    />
                    <span>:</span>
                    <Input
                      value={value}
                      onChange={(e) => {
                        const newDefinitions = definitions;
                        newDefinitions[page][i][1] = e.target.value;
                        setDefinitions(newDefinitions);
                      }}
                      onBlur={() => {
                        updateDefinitions(definitions);
                      }}
                    />
                    <IconButton
                      icon={<Trash />}
                      aria-label="Delete this definition"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        const newDefinitions = definitions;
                        newDefinitions[page].splice(i, 1);
                        setDefinitions(newDefinitions);
                        updateDefinitions(newDefinitions);
                      }}
                    />
                  </Flex>
                ))
              ) : (
                <Center>
                  <Heading size="sm" color="gray.500">
                    No definitions
                  </Heading>
                </Center>
              )}
            </Stack>
          </motion.div>
        </Container>
      </AnimatePresence>
    </>
  );
};

export default Definition;
