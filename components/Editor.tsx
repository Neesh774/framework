import { FC, forwardRef } from "react";
import {
  chakra,
  Icon,
  IconButton,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Stack,
  useColorModeValue,
  StackDivider,
  ButtonGroup,
  Flex,
  Heading as ChakraHeading,
} from "@chakra-ui/react";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";

export type SelectItemProps<T = string | number> = {
  label: string;
  value: T;
};

type Level = 1 | 2 | 3 | 4 | 5 | 6;

const HeadingSelectItems: SelectItemProps<Level>[] = [
  { value: 1, label: "Heading 1" },
  { value: 2, label: "Heading 2" },
  { value: 3, label: "Heading 3" },
  { value: 4, label: "Heading 4" },
  { value: 5, label: "Heading 5" },
  { value: 6, label: "Heading 6" },
];

const renderFormat = (value: Level, label: string) => {
  switch (value) {
    case 1:
      return <h1>{label}</h1>;
    case 2:
      return <h2>{label}</h2>;
    case 3:
      return <h3>{label}</h3>;
    case 4:
      return <h4>{label}</h4>;
    case 5:
      return <h5>{label}</h5>;
    case 6:
      return <h6>{label}</h6>;
    default:
      return <p>{label}</p>;
  }
};

const StyledEditor = chakra(EditorContent);

export interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  isInvalid?: boolean;
}

export const RichEditor: FC<
  RichEditorProps & { onBlur?: () => void; placeholder?: string }
> = forwardRef(
  (
    { value, onChange = () => {}, isInvalid, onBlur = () => {}, placeholder },
    ref: any
  ) => {
    const editor = useEditor({
      extensions: [StarterKit],
      content: value ?? "",
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    const isBold = editor?.isActive("bold");
    const isItalic = editor?.isActive("italic");
    const isStrike = editor?.isActive("strike");
    const isBlockQuote = editor?.isActive("blockquote");
    const isOrderedList = editor?.isActive("orderedList");
    const isBulletList = editor?.isActive("bulletList");

    const getActiveHeading = (level: Level) =>
      editor?.isActive("heading", { level }) ? String(level) : undefined;
    const isH1 = getActiveHeading(1);
    const isH2 = getActiveHeading(2);
    const isH3 = getActiveHeading(3);
    const isH4 = getActiveHeading(4);
    const isH5 = getActiveHeading(5);
    const isH6 = getActiveHeading(6);
    const isHeading = isH1 || isH2 || isH3 || isH4 || isH5 || isH6;

    const focus = () => editor?.chain().focus();
    const onBold = () => editor?.chain().focus().toggleBold().run();
    const onItalic = () => editor?.chain().focus().toggleItalic().run();
    const onStrike = () => editor?.chain().focus().toggleStrike().run();
    const onBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
    const onOrderedList = () =>
      editor?.chain().focus().toggleOrderedList().run();
    const onBulletList = () => editor?.chain().focus().toggleBulletList().run();
    const onHorizontalRule = () =>
      editor?.chain().focus().setHorizontalRule().run();
    const onHeading = (level: Level) => () =>
      editor?.chain().focus().toggleHeading({ level }).run();

    const borderColor = useColorModeValue("gray.400", "whiteAlpha.400");

    if (!editor) return <></>;

    return (
      <Box
        pb="4"
        w="full"
        onClick={focus}
        borderRadius="md"
        border="2px solid"
        borderColor={isInvalid ? "red.500" : borderColor}
        boxShadow={isInvalid ? "invalidInput" : "none"}
      >
        <Flex
          dir="row"
          justifyContent="space-between"
          alignItems="center"
          mb="4"
          pr="4"
          borderBottom="1px solid"
          borderBottomColor={borderColor}
        >
          <Stack p="1" direction="row" divider={<StackDivider />} spacing="2">
            <ButtonGroup>
              <IconButton
                size="sm"
                aria-label="bold"
                variant={isBold ? "solid" : "ghost"}
                icon={<Bold />}
                onClick={onBold}
              />
              <IconButton
                size="sm"
                aria-label="italic"
                variant={isItalic ? "solid" : "ghost"}
                icon={<Italic />}
                onClick={onItalic}
              />
              <IconButton
                size="sm"
                aria-label="italic"
                variant={isStrike ? "solid" : "ghost"}
                icon={<Strikethrough />}
                onClick={onStrike}
              />
            </ButtonGroup>
            <ButtonGroup>
              <IconButton
                size="sm"
                aria-label="quote"
                variant={isBlockQuote ? "solid" : "ghost"}
                icon={<Quote />}
                onClick={onBlockquote}
              />
              <IconButton
                size="sm"
                aria-label="ordered list"
                variant={isOrderedList ? "solid" : "ghost"}
                icon={<ListOrdered />}
                onClick={onOrderedList}
              />
              <IconButton
                size="sm"
                aria-label="bullet list"
                variant={isBulletList ? "solid" : "ghost"}
                icon={<List />}
                onClick={onBulletList}
              />
              <Menu>
                <MenuButton
                  as={IconButton}
                  size="sm"
                  icon={<Heading />}
                  aria-label="formatting"
                  variant="ghost"
                />
                <MenuList boxShadow="lg">
                  <MenuOptionGroup value={isHeading} type="radio">
                    {HeadingSelectItems.map(({ value, label }) => (
                      <MenuItemOption
                        value={String(value)}
                        key={value}
                        onClick={onHeading(value as any)}
                      >
                        {renderFormat(value, label)}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </ButtonGroup>
          </Stack>
          <ChakraHeading size="sm" color={borderColor} fontWeight="semibold">
            {placeholder}
          </ChakraHeading>
        </Flex>
        <StyledEditor
          ref={ref}
          editor={editor}
          sx={{
            minH: "36",
            pl: 4,
            "& :focus-visible": {
              outline: "0px",
            },
            li: {
              marginLeft: "2rem",
            },
            blockquote: {
              borderLeft: "4px solid",
              paddingLeft: "1rem",
            },
            h1: {
              fontSize: "2rem",
            },
            h2: {
              fontSize: "1.5rem",
            },
            h3: {
              fontSize: "1.17rem",
            },
            h4: {
              fontSize: "1rem",
            },
            h5: {
              fontSize: "0.83rem",
            },
            h6: {
              fontSize: "0.67rem",
            },
          }}
          paddingLeft="4"
          onBlur={onBlur}
          placeholder={placeholder}
        />
      </Box>
    );
  }
);

RichEditor.displayName = "RichEditor";

export default RichEditor;
