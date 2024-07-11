import { writable } from "svelte/store";

export const guesses = writable<Array<Array<JSON>>>([[], []]);