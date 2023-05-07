import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default {
	plugins: [
		react(),
		federation({
			name: "app",
			remotes: {
				commons_app: "http://localhost:5000/assets/remoteEntry.js",
			},
			shared: ["react", "react-dom"],
		}),
	],
	build: {
		modulePreload: false,
		target: "esnext",
		minify: false,
		cssCodeSplit: false,
	},
};
