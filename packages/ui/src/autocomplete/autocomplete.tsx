import {
  Autocomplete as AriaAutocomplete,
  type AutocompleteProps as AriaAutocompleteProps,
} from "react-aria-components";

export type AutocompleteProps<T = object> = AriaAutocompleteProps<T>;

export function Autocomplete<T extends object>(props: AutocompleteProps<T>) {
  return <AriaAutocomplete {...props} />;
}
