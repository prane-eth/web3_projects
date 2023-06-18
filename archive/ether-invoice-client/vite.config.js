import react from "@vitejs/plugin-react";
import path from 'path';

// https://vitejs.dev/config/
export default {
	plugins: [react()],
	resolve: {
		alias: {
			Commons: path.resolve(__dirname, "../common-react-components/src"),
			Components: path.resolve(__dirname, "./src/components"),
			Assets: path.resolve(__dirname, "./src/assets"),
		},
	},
};
