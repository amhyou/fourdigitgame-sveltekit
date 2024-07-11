<script>
    import { goto } from "$app/navigation";

    let url = "https://lichess.org/hahahah";

    let buttonText = "Copy";
    let buttonColor = "bg-blue-600";

    function copyToClipboard() {
        navigator.clipboard.writeText(url).then(() => {
            buttonText = "Copied!";
            buttonColor = "bg-green-600";
            setTimeout(() => {
                buttonText = "Copy";
                buttonColor = "bg-blue-600";
            }, 1000);
        });
    }
    function cancelGame() {
        goto("/");
    }
</script>

<div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
>
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h1 class="text-2xl font-semibold mb-4">Challenge to a game</h1>
        <div class="bg-green-700 p-4 rounded-lg mb-4">
            <div class="text-xl font-bold">Blitz</div>
            <div class="text-lg">5+3</div>
            <div class="text-sm mt-2">Custom rules:</div>
            <div class="text-sm mt-1">Random side</div>
            <div class="text-sm">Casual</div>
        </div>
        <div class="flex flex-col md:flex-row items-center justify-around">
            <div
                class="mb-4 md:mb-0 w-full md:w-1/2 flex flex-col items-center"
            >
                <div class="text-sm mb-2">
                    To invite someone to play, give this URL
                </div>
                <div class="flex w-full">
                    <input
                        type="text"
                        class="bg-gray-700 p-2 rounded-l-md w-full"
                        value={url}
                        readonly
                    />
                    <button
                        class={`p-2 rounded-r-md text-white transition duration-200 ${buttonColor}`}
                        on:click={copyToClipboard}
                    >
                        {buttonText}
                    </button>
                </div>
                <div class="text-xs mt-2">
                    The first person to come to this URL will play with you.
                </div>
            </div>
            <div class="flex flex-col items-center">
                <div class="text-sm mb-2">
                    Or let your opponent scan this QR code
                </div>
                <img
                    src="https://static.vecteezy.com/system/resources/previews/002/557/391/original/qr-code-for-scanning-free-vector.jpg"
                    alt="QR Code"
                    class="w-32 h-32"
                />
            </div>
        </div>
        <button
            on:click={cancelGame}
            class="bg-red-600 mt-6 py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
            >Cancel</button
        >
    </div>
</div>
