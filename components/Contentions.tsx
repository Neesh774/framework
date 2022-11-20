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
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { Plus, Trash } from "lucide-react";
import RichEditor from "./Editor";

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

const Contentions = ({
  contentions,
  setContentions,
  updateContentions,
  side,
  setSide,
  oneSided,
}: {
  contentions: Case["contentions"];
  setContentions: (contentions: Case["contentions"]) => void;
  updateContentions: (contentions: Case["contentions"]) => void;
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

  const contentionBg = useColorModeValue("gray.100", "whiteAlpha.100");

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
                  {page == "gov" ? "Gov" : "Opp"} Contentions
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
                  setContentions({
                    ...contentions,
                    [page]: [
                      ...contentions[page],
                      {
                        contention: "",
                        warrant: "",
                        impact: "",
                      },
                    ],
                  });
                }}
              />
            </Flex>
            <Stack spacing="2" my="2">
              {contentions[page].length > 0 ? (
                contentions[page].map((contention, i) => (
                  <Box
                    key={i}
                    bg={contentionBg}
                    rounded="md"
                    p="2"
                    backgroundColor={contentionBg}
                    paddingX="4"
                    paddingBottom="8"
                  >
                    <Stack spacing="2">
                      <Flex gap="2">
                        <Input
                          placeholder="Contention"
                          value={contention.contention}
                          variant="flushed"
                          onChange={(e) => {
                            const newContentions = contentions;
                            newContentions[page][i].contention = e.target.value;
                            setContentions(newContentions);
                          }}
                          onBlur={() => {
                            updateContentions(contentions);
                          }}
                        />
                        <IconButton
                          icon={<Trash />}
                          aria-label="Delete contention"
                          variant="ghost"
                          onClick={() => {
                            const newContentions = contentions;
                            newContentions[page].splice(i, 1);
                            setContentions(newContentions);
                            updateContentions(newContentions);
                          }}
                          colorScheme="red"
                        />
                      </Flex>
                      <RichEditor
                        placeholder="Warrant"
                        value={contention.warrant}
                        onChange={(value) => {
                          const newContentions = contentions;
                          newContentions[page][i].warrant = value;
                          setContentions(newContentions);
                        }}
                        onBlur={() => {
                          updateContentions(contentions);
                        }}
                      />
                      <RichEditor
                        placeholder="Impact"
                        value={contention.impact}
                        onChange={(value) => {
                          const newContentions = contentions;
                          newContentions[page][i].impact = value;
                          setContentions(newContentions);
                        }}
                        onBlur={() => {
                          updateContentions(contentions);
                        }}
                      />
                    </Stack>
                  </Box>
                ))
              ) : (
                <Center>
                  <Heading size="sm" color="gray.500">
                    No contentions
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

export default Contentions;
