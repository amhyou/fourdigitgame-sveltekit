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

    let timer = 60;
    // let interval: number;
    // onMount(() => {
    //     interval = setInterval(() => {
    //         if (timer > 0) {
    //             timer--;
    //         } else {
    //             clearInterval(interval);
    //         }
    //         console.log(timer);
    //     }, 1000);
    // });

    export let player: number;
    export let turn: number = 0;
    $: canGuess = player == turn;

    let guess = "";
    let currentGuesses: Array<Array<Message>>;
    const unsubscribe = guesses.subscribe((value) => (currentGuesses = value));

    function submitGuess() {
        let joinMsg = {
            game: $page.params.game,
            player: player,
            action: "guess",
            guess: guess,
        };
        socket.send(JSON.stringify(joinMsg));
        guess = "";
        // turn = 1 - turn;
        // timer = 60;
    }

    onMount(() => {
        return () => {
            unsubscribe();
        };
    });
</script>

<div class="flex w-full h-screen">
    <div
        class="card bg-base-300 rounded-box h-full flex-grow place-items-center flex flex-col space-y-6"
    >
        <Timer timeLeft={timer} starting={canGuess} />

        <div class="join">
            <input
                bind:value={guess}
                class="input input-bordered join-item input-accent"
                inputmode="numeric"
                pattern="\d{4}"
                maxlength="4"
                type="text"
                placeholder="*** write your guess"
                disabled={!canGuess}
            />
            <button
                class="btn join-item rounded-r-full btn-accent btn-outline"
                disabled={!canGuess}
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
        <Timer timeLeft={timer} starting={canGuess} />

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
