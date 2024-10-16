import { fileURLToPath, URL } from "node:url"
// import glsl from 'vite-plugin-glsl';

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
	//  root: 'src',
	publicDir: "public",
	build: {
		outDir: "dist",
		emptyOutDir: true,
		assetsDir: "assets",
		// sourcemap: true
	},
	plugins: [
		vue(),
		// glsl()
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
                    @import '@/styles/tools/mq';\n
                    @import '@/styles/tools/variables';\n
                    @import '@/styles/tools/mixins';\n
                `
			}
		}
	}
})
