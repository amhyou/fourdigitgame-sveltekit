<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { guesses } from "$lib/store";
    import Timer from "./Timer.svelte";
    import Guess from "./Guess.svelte";

    interface Message {
        id?: string;
        game: string;
        action: string;
        player: number;
        guess?: string;
        exact?: number;
        misplaced?: number;
    }

    export let socket: WebSocket;
    export let timer: number;
    export let player: number;
    export let turn: number = 0;
    $: myGuess = player == turn;
    $: yourGuess = 1 - player == turn;

    let guess = "";
    let currentGuesses: Array<Array<Message>>;
    const unsubscribe = guesses.subscribe((value) => (currentGuesses = value));

    function submitGuess() {
        if (guess.length != 4 || !isvalidGuess) {
            return;
        }
        let joinMsg = {
            game: $page.params.game,
            player: player,
            action: "guess",
            guess: guess,
        };
        socket.send(JSON.stringify(joinMsg));
        guess = "";
    }

    onMount(() => {
        return () => {
            unsubscribe();
        };
    });

    $: uniqueDigits = new Set(guess);
    $: isvalidGuess =
        /^\d*$/.test(guess) &&
        guess.length < 5 &&
        guess.length == uniqueDigits.size;
</script>

<div class="flex w-full h-screen">
    <div
        class="card bg-base-300 rounded-box h-full flex-grow place-items-center flex flex-col space-y-6"
    >
        <Timer timeLeft={timer} starting={myGuess} />

        <div class="join">
            <input
                bind:value={guess}
                class="input input-bordered join-item input-accent"
                inputmode="numeric"
                pattern="\d{4}"
                maxlength="4"
                type="text"
                placeholder="*** write your guess"
                disabled={yourGuess}
                class:input-error={!isvalidGuess}
            />
            <button
                class="btn join-item rounded-r-full btn-accent btn-outline"
                disabled={yourGuess}
                on:click={submitGuess}>Guess</button
            >
        </div>

        <ul class="timeline timeline-vertical">
            {#each currentGuesses[player] as guessMessage, index}
                <Guess {guessMessage} {index} />
            {/each}
        </ul>
    </div>
    <div class="divider divider-horizontal">VS</div>
    <div
        class="card bg-base-300 rounded-box h-full flex-grow place-items-center flex flex-col space-y-6"
    >
        <Timer timeLeft={timer} starting={yourGuess} />

        <input
            type="text"
            placeholder="Your oppenent is guessing ..."
            class="input input-bordered w-full max-w-xs"
            disabled
        />

        <ul class="timeline timeline-vertical">
            {#each currentGuesses[1 - player] as guessMessage, index}
                <Guess {guessMessage} {index} />
            {/each}
        </ul>
    </div>
</div>
