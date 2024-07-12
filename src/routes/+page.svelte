<script>
    import { goto } from "$app/navigation";

    async function newGame() {
        const response = await fetch("http://localhost:8000/new");
        const game = await response.json();
        console.log(game);
        goto(`/${game.id}`);
    }
</script>

<div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">Four Digit Game</h1>
            <p class="py-6"></p>
            <br /><br /><br />
            <button class="btn btn-primary" on:click={newGame}
                >Create New Game</button
            >
        </div>
    </div>
</div>
