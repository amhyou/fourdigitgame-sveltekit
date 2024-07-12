<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/stores";
    import { guesses } from "$lib/store";
    import Game from "./Game.svelte";
    import Waiting from "./Waiting.svelte";
    import Error from "./Error.svelte";

    interface Message {
        id?: string;
        game: string;
        action: string;
        player: number;
        guess?: string;
        exact?: number;
        misplaced?: number;
    }

    let status = "start";
    let socket: WebSocket;
    let player: number;
    let turn: number = 0;
    let lastMessage: Message;
    let gameStatus: string;
    let error: boolean = false;

    onMount(() => {
        socket = new WebSocket("ws://localhost:8000/start");

        socket.addEventListener("open", () => {
            console.log("Connected to WebSocket server");
            let joinMsg = {
                game: $page.params.game,
                player: 2,
                action: "join",
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
                    status = "ongoing";
                    console.log(player);
                    break;
                case "guess":
                    guesses.update((val: Array<Array<Message>>) => {
                        if (message.player == 1) {
                            if (lastMessage.exact == 4 && message.exact != 4) {
                                // player 1 wins
                                let stopMsg = {
                                    game: $page.params.game,
                                    player: 0,
                                    action: "stop",
                                    reason: "secret number found",
                                };
                                socket.send(JSON.stringify(stopMsg));
                            } else if (
                                lastMessage.exact != 4 &&
                                message.exact == 4
                            ) {
                                // player 2 wins
                                let stopMsg = {
                                    game: $page.params.game,
                                    player: 1,
                                    action: "stop",
                                    reason: "secret number found",
                                };
                                socket.send(JSON.stringify(stopMsg));
                            } else if (
                                lastMessage.exact == 4 &&
                                message.exact == 4
                            ) {
                                // tie
                                let stopMsg = {
                                    game: $page.params.game,
                                    player: 2,
                                    action: "stop",
                                    reason: "tie",
                                };
                                socket.send(JSON.stringify(stopMsg));
                            }
                        }
                        lastMessage = message;
                        val[message.player] = [...val[message.player], message];
                        return val;
                    });
                    turn = 1 - message.player;
                    console.log(message.player);
                    break;
                case "stop":
                    status = "ended";
                    if (message.player == player) {
                        gameStatus = "Congratulations! You WON";
                    } else if (message.player == 1 - player) {
                        gameStatus = "Unfortunately! You LOST";
                    } else {
                        gameStatus = "Tie !";
                    }
                    break;
                case "notfound":
                    error = true;
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

{#if error}
    <Error />
{:else if status == "start"}
    <Waiting />
{:else}
    <Game {player} {socket} {turn} />
    <dialog id="my_modal_2" class="modal" class:modal-open={status == "ended"}>
        <div class="modal-box">
            <h3 class="text-lg font-bold">{gameStatus}</h3>
            <p class="py-4">Game is in continuous improvements</p>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
{/if}
