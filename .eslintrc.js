module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:vue/vue3-essential"
	],
	"overrides": [
		{
			"files": [ "*.js" ],
			"rules": {
				"indent": [ "error", "tab" ] // Override indent rule for JS files
			}
		},
		{
			"env": {
				"node": true
			},
			"files": [
				".eslintrc.{js,cjs}"
			],
			"parserOptions": {
				"sourceType": "script"
			}
		}
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [ "vue" ],
	"rules": {
		"indent": "off", // Turn off indent rule globally
		"semi": [ "error", "never" ],
		"quotes": [ "error", "double" ],
		"vue/html-indent": [ "error", "tab" ],
		"vue/script-indent": [ "error", "tab", {
			"baseIndent": 1,
			"switchCase": 0,
			"ignores": []
		} ],
		"key-spacing": [ "error", {
			"beforeColon": false,
			"afterColon": true,
			"mode": "strict"
		} ],
		"keyword-spacing": [ "error", {
			"before": true,
			"after": true
		} ],
		"block-spacing": [ "error", "always" ],
		"object-curly-spacing": [ "error", "always" ],
		"array-bracket-spacing": [ "error", "always" ],
		"computed-property-spacing": [ "error", "never" ],
		"arrow-spacing": [ "error", {
			"before": true,
			"after": true
		} ],
		"yield-star-spacing": [ "error", "both" ],
		"space-infix-ops": "error",
		"no-tabs": "off",
		"no-unused-vars": "off",
		"vue/no-unused-vars": "off",
		"vue/multi-word-component-names": "off",
		"vue/max-attributes-per-line": 1,
		// "max-len": [ "warn", { "code": 100, "ignoreComments": true, "tabWidth": 4 } ],
		"no-undef": "off",
	}
}
