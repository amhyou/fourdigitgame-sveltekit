<script>
    import { goto } from "$app/navigation";

    function newGame() {
        goto("/111111example");
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
