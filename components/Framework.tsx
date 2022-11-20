import * as React from "react";
import { useState, useEffect } from "react";
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

const Framework = ({
  framework,
  setFramework,
  updateFramework,
  side,
  setSide,
  oneSided,
}: {
  framework: Case["framework"];
  setFramework: (framework: Case["framework"]) => void;
  updateFramework: (framework: Case["framework"]) => void;
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
                  {page == "gov" ? "Gov" : "Opp"} Framework
                </Heading>
                {!oneSided && (
                  <Switch
                    colorScheme="purple"
                    isChecked={page == "opp"}
                    onChange={() => setPage([page == "gov" ? "opp" : "gov", 1])}
                  />
                )}
              </HStack>
            </Flex>
            <Box my="2">
              <RichEditor
                value={framework[page]}
                onChange={(value) => {
                  setFramework({
                    ...framework,
                    [page]: value,
                  });
                }}
                onBlur={() => {
                  updateFramework(framework);
                }}
              />
            </Box>
          </motion.div>
        </Container>
      </AnimatePresence>
    </>
  );
};

export default Framework;
