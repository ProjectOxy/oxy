export const layers = {
  components: "oxy.components",
  utilities: "oxy.utilities",
} as const;

export const layerOrder = `@layer ${layers.components}, ${layers.utilities};`;

export const stylexLayers = { prefix: layers.components, after: [layers.utilities] };
