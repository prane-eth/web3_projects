import react from "@vitejs/plugin-react";
// import federation from "@originjs/vite-plugin-federation";
import path from 'path';

// https://vitejs.dev/config/
export default {
	plugins: [
		react(),
		// federation({
		// 	name: "app",
		// 	remotes: {
		// 		commons_app: "http://localhost:5000/assets/remoteEntry.js",
		// 	},
		// 	shared: ["react", "react-dom"],
		// }),
	],
	resolve: {
		alias: {
			Commons: path.resolve(__dirname, "../common-react-components/src"),
			Components: path.resolve(__dirname, "./src/components"),
			Assets: path.resolve(__dirname, "./src/assets"),
		},
	},
};
