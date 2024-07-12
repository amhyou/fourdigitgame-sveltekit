import { writable } from "svelte/store";

interface Message {
    id?: string;
    game: string;
    action: string;
    player: number;
    guess?: string;
    exact?: number;
    misplaced?: number;
}

export const guesses = writable<Array<Array<Message>>>([[], []]);