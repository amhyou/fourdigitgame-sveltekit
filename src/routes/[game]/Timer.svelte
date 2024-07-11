<script>
    export let timeLeft;
    export let starting;
</script>

<span class="countdown font-mono text-6xl">
    <span style="--value:{starting ? 60 : timeLeft};"></span>
</span>
