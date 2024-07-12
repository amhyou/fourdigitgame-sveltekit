import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// server: {
	// 	host: "localhost", // This will bind the server to 0.0.0.0
	// 	port: 3000, // You can specify any port you prefer
	// },
});
