import { flattenTokens, resolveTokens, type Theme } from "@oxy/tokens";
import {
  Button,
  ColorArea,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorThumb,
  Dialog,
  DialogTrigger,
  FieldError,
  Group,
  Input,
  Label,
  ListBoxItem,
  Popover,
  SearchField,
  Select,
  SliderTrack,
  TextField,
} from "@oxy/ui";
import { useMemo, useState } from "react";
import { type Color, parseColor } from "react-aria-components";
import { tokenGroups, type TokenValues } from "./theme.ts";

type TokenGroup = (typeof tokenGroups)[number];

export interface TokenEditorProps {
  theme: Theme;
  overrides: TokenValues;
  onChange: (path: string, value: string) => string | undefined;
  onReset: (path: string) => void;
}

const colorOf = (value: string) => {
  try {
    return parseColor(value);
  } catch {
    return undefined;
  }
};

export function TokenEditor({ theme, overrides, onChange, onReset }: TokenEditorProps) {
  const [group, setGroup] = useState<TokenGroup>("color");
  const [query, setQuery] = useState("");
  const resolved = useMemo(() => resolveTokens(theme.tokens), [theme]);
  const rows = [...flattenTokens(theme.tokens[group], `${group}.`)].filter(([path]) =>
    path.includes(query.trim()),
  );

  return (
    <div className="grid grid-cols-1 gap-md">
      <Select
        label="Token group"
        className="outlined dense"
        value={group}
        onChange={(key) => setGroup(key as TokenGroup)}
      >
        {tokenGroups.map((name) => (
          <ListBoxItem key={name} id={name}>
            {name}
          </ListBoxItem>
        ))}
      </Select>
      <SearchField aria-label="Filter tokens" className="dense" value={query} onChange={setQuery}>
        <Group>
          <Input placeholder="Filter tokens" />
        </Group>
      </SearchField>
      {rows.map(([path, value]) => (
        <TokenRow
          key={path}
          path={path}
          value={value}
          color={colorOf(resolved.get(path) ?? value)}
          isOverridden={path in overrides}
          onChange={onChange}
          onReset={onReset}
        />
      ))}
    </div>
  );
}

interface TokenRowProps extends Pick<TokenEditorProps, "onChange" | "onReset"> {
  path: string;
  value: string;
  color?: Color;
  isOverridden: boolean;
}

function TokenRow({ path, value, color, isOverridden, onChange, onReset }: TokenRowProps) {
  const [draft, setDraft] = useState<string>();
  const [error, setError] = useState<string>();

  const change = (next: string) => {
    const problem = next.trim() ? onChange(path, next) : "Enter a value";
    setError(problem);
    setDraft(problem === undefined ? undefined : next);
  };

  const discardDraft = () => {
    setDraft(undefined);
    setError(undefined);
  };

  return (
    <div className="flex items-start gap-xs">
      {color && <ColorTokenPicker path={path} color={color} onChange={change} />}
      <TextField
        className="outlined dense grow min-w-none"
        value={draft ?? value}
        onChange={change}
        onBlur={discardDraft}
        isInvalid={error !== undefined}
      >
        <Label>{path}</Label>
        <Input />
        <FieldError>{error}</FieldError>
      </TextField>
      {isOverridden && (
        <Button className="text xs" aria-label={`Reset ${path}`} onPress={() => onReset(path)}>
          Reset
        </Button>
      )}
    </div>
  );
}

interface ColorTokenPickerProps {
  path: string;
  color: Color;
  onChange: (value: string) => void;
}

function ColorTokenPicker({ path, color, onChange }: ColorTokenPickerProps) {
  return (
    <DialogTrigger>
      <Button className="text xs square" aria-label={`Pick ${path}`}>
        <ColorSwatch color={color} />
      </Button>
      <Popover placement="bottom start">
        <Dialog aria-label={path}>
          <ColorPicker value={color} onChange={(next) => onChange(next.toString("hex"))}>
            <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness">
              <ColorThumb />
            </ColorArea>
            <ColorSlider colorSpace="hsb" channel="hue">
              <Label />
              <SliderTrack>
                <ColorThumb />
              </SliderTrack>
            </ColorSlider>
          </ColorPicker>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
