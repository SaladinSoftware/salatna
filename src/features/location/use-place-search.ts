import { useEffect, useState } from "react";

import { searchPlaces, type PlaceResult } from "./geocoding";

/** Waits this long after the last keystroke before hitting the network. */
const DEBOUNCE_MS = 350;

type State = {
  results: PlaceResult[];
  isSearching: boolean;
  hasFailed: boolean;
};

const IDLE: State = { results: [], isSearching: false, hasFailed: false };

/** Debounced, self-cancelling place search. Empty queries never hit the network. */
export function usePlaceSearch(query: string, language: string) {
  const [state, setState] = useState<State>(IDLE);

  useEffect(() => {
    if (query.trim().length < 2) {
      setState(IDLE);
      return;
    }

    const controller = new AbortController();
    setState((previous) => ({ ...previous, isSearching: true, hasFailed: false }));

    const timer = setTimeout(() => {
      searchPlaces(query, language, controller.signal)
        .then((results) => setState({ results, isSearching: false, hasFailed: false }))
        .catch((cause: Error) => {
          if (cause.name === "AbortError") return;
          setState({ results: [], isSearching: false, hasFailed: true });
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, language]);

  return state;
}
