import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from 'path';

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
	resolve: {
		alias: {
			"my-commons": path.resolve(__dirname, "../common-react-components/src"),
			// "my-commons": "https://cdn.jsdelivr.net/gh/vh-praneeth/web3_projects@main/common-react-components/src/index.jsx",
		},
	},
};
