import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default {
	plugins: [
		react(),
		federation({
			name: "commons_app",
			filename: "remoteEntry.js",
			exposes: {
				"./AppCommon": "./src/AppCommon",
				"./Navbar": "./src/Navbar",
				"./Utils": "./src/Utils",
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
