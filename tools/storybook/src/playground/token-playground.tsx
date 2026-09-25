import { type ColorScheme, colorSchemes, type Contrast, contrasts } from "@oxy/material-theme";
import { color, radius, space } from "@oxy/tokens/semantic.stylex";
import {
  Button,
  ColorField,
  ColorPicker,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  Heading,
  Input,
  Label,
  OxyProvider,
  ToggleButton,
  ToggleButtonGroup,
} from "@oxy/ui";
import * as stylex from "@stylexjs/stylex";
import { type Key, type ReactNode, useState } from "react";
import { seeds } from "../seed-theme.ts";
import {
  defaultPlaygroundOptions,
  type ExportFormat,
  exportFormats,
  exportTheme,
  type Playground,
  type PlaygroundOptions,
  playgroundTheme,
} from "./theme.ts";
import { TokenEditor } from "./token-editor.tsx";

const expanded = "@media (min-width: 840px)";

const styles = stylex.create({
  layout: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr)", [expanded]: "22.5rem minmax(0, 1fr)" },
    gap: space["--oxy-space-lg"],
    alignItems: "start",
  },
  panel: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: space["--oxy-space-xl"],
    alignContent: "start",
    position: { default: "static", [expanded]: "sticky" },
    insetBlockStart: 0,
    maxBlockSize: { default: "none", [expanded]: "calc(100dvh - 2rem)" },
    overflowY: "auto",
    paddingInlineEnd: space["--oxy-space-xs"],
  },
  section: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: space["--oxy-space-md"],
  },
  preview: {
    minInlineSize: 0,
    padding: space["--oxy-space-lg"],
    borderRadius: radius["--oxy-radius-lg"],
    backgroundColor: color["--oxy-color-surface"],
    color: color["--oxy-color-on-surface"],
  },
  code: {
    margin: 0,
    maxBlockSize: "20rem",
    overflow: "auto",
    padding: space["--oxy-space-md"],
    borderRadius: radius["--oxy-radius-md"],
    backgroundColor: color["--oxy-color-surface-container"],
    fontFamily: "monospace",
    fontSize: 12,
  },
});

const firstKey = (keys: Set<Key>) => [...keys][0] as string;

export interface TokenPlaygroundProps {
  defaultOptions?: PlaygroundOptions;
  children: ReactNode;
}

export function TokenPlayground({
  defaultOptions = defaultPlaygroundOptions,
  children,
}: TokenPlaygroundProps) {
  const [{ options, theme }, setPlayground] = useState<Playground>(() => ({
    options: defaultOptions,
    theme: playgroundTheme(defaultOptions),
  }));

  const apply = (next: PlaygroundOptions) =>
    setPlayground({ options: next, theme: playgroundTheme(next) });

  const setOption = <K extends keyof PlaygroundOptions>(key: K, value: PlaygroundOptions[K]) =>
    apply({ ...options, [key]: value });

  const setToken = (path: string, value: string) => {
    try {
      setOption("tokens", { ...options.tokens, [path]: value });
    } catch (error) {
      return (error as Error).message;
    }
  };

  const resetToken = (path: string) => {
    const { [path]: _, ...tokens } = options.tokens;
    setOption("tokens", tokens);
  };

  return (
    <div {...stylex.props(styles.layout)}>
      <div {...stylex.props(styles.panel)}>
        <section {...stylex.props(styles.section)}>
          <Heading level={2} className="type-title-medium">
            Theme
          </Heading>
          <ColorPicker
            value={options.seed}
            onChange={(seed) => setOption("seed", seed.toString("hex"))}
          >
            <div className="flex items-center gap-md">
              <ColorSwatch className="md" />
              <ColorField className="outlined dense grow">
                <Label>Seed</Label>
                <Input />
              </ColorField>
            </div>
            <ColorSwatchPicker aria-label="Seed presets">
              {seeds.map(({ name, value }) => (
                <ColorSwatchPickerItem key={value} color={value}>
                  <ColorSwatch colorName={name} />
                </ColorSwatchPickerItem>
              ))}
            </ColorSwatchPicker>
          </ColorPicker>
          <ToggleButtonGroup
            aria-label="Scheme"
            className="xs"
            disallowEmptySelection
            selectedKeys={[options.scheme]}
            onSelectionChange={(keys) => setOption("scheme", firstKey(keys) as ColorScheme)}
          >
            {colorSchemes.map((scheme) => (
              <ToggleButton key={scheme} id={scheme} className="tonal xs">
                {scheme}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            aria-label="Contrast"
            className="xs"
            disallowEmptySelection
            selectedKeys={[options.contrast]}
            onSelectionChange={(keys) => setOption("contrast", firstKey(keys) as Contrast)}
          >
            {contrasts.map((contrast) => (
              <ToggleButton key={contrast} id={contrast} className="tonal xs">
                {contrast}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </section>
        <section {...stylex.props(styles.section)}>
          <Heading level={2} className="type-title-medium">
            Tokens
          </Heading>
          <TokenEditor
            theme={theme}
            overrides={options.tokens}
            onChange={setToken}
            onReset={resetToken}
          />
        </section>
        <ThemeExport options={options} theme={theme} />
        <Button className="outlined" onPress={() => apply(defaultOptions)}>
          Reset all
        </Button>
      </div>
      <OxyProvider theme={theme} scheme={options.scheme}>
        <div {...stylex.props(styles.preview)}>{children}</div>
      </OxyProvider>
    </div>
  );
}

const formats = Object.keys(exportFormats) as ExportFormat[];

function ThemeExport(playground: Playground) {
  const [format, setFormat] = useState<ExportFormat>("createMaterialTheme");
  const [copied, setCopied] = useState<string>();
  const json = exportTheme(format, playground);

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(json);
  };

  const download = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    link.download = `${format}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <section {...stylex.props(styles.section)}>
      <Heading level={2} className="type-title-medium">
        Export
      </Heading>
      <ToggleButtonGroup
        aria-label="Export format"
        className="xs"
        disallowEmptySelection
        selectedKeys={[format]}
        onSelectionChange={(keys) => setFormat(firstKey(keys) as ExportFormat)}
      >
        {formats.map((name) => (
          <ToggleButton key={name} id={name} className="tonal xs">
            {name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <pre {...stylex.props(styles.code)}>
        <code>{json}</code>
      </pre>
      <div className="flex gap-sm">
        <Button className="tonal sm" onPress={copy}>
          {copied === json ? "Copied" : "Copy"}
        </Button>
        <Button className="outlined sm" onPress={download}>
          Download
        </Button>
      </div>
    </section>
  );
}
