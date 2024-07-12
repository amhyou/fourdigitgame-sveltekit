<script>
    export let timeLeft;
    export let starting;
</script>

<span class="countdown font-mono text-6xl">
    <span style="--value:{starting ? timeLeft : 60};"></span>
</span>
