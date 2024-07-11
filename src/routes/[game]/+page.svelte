<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/stores";
    import { guesses } from "$lib/store";
    import Game from "./Game.svelte";
    import Waiting from "./Waiting.svelte";

    let start = false;

    let socket: WebSocket;

    let player: number;

    let turn: number = 0;

    onMount(() => {
        socket = new WebSocket("ws://localhost:8000/ws");

        socket.addEventListener("open", () => {
            console.log("Connected to WebSocket server");
            let joinMsg = {
                game: $page.params.game,
                player: 2,
                action: "join",
                content: "",
            };
            socket.send(JSON.stringify(joinMsg));
        });

        socket.addEventListener("message", (event) => {
            console.log(event.data);
            let message = JSON.parse(event.data);
            switch (message.action) {
                case "join":
                    player = message.player;
                    console.log(player);
                    break;
                case "start":
                    start = true;
                    console.log(player);
                    break;
                case "guess":
                    guesses.update((val) => {
                        val[message.player] = [...val[message.player], message];
                        return val;
                    });
                    turn = 1 - message.player;
                    console.log(message.player);
                    break;
                default:
                    break;
            }
        });

        socket.addEventListener("close", () => {
            console.log("Disconnected from WebSocket server");
        });

        return () => {
            socket.close();
        };
    });
</script>

{#if !start}
    <Waiting />
{:else}
    <Game {player} {socket} {turn} />
{/if}
