# Forget Me Not
This template is a minimal starter to put you on track to develop with Vue 3, Vite and Three.js. It does not support Typescript.

## Features
- Vue 3
- Vue Router
- Vite
- SCSS
- Three.js
- State management
- Minimal scaffold
- ESLint + Editor Config + StyleLint

## Recommended IDE Setup
[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur). The recommended VSC extensions are set inside `.vscode/extensions.json`, so your IDE should automatically suggest you to install them.

## Customize configuration
See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup
```sh
npm install
```

### Compile and Hot-Reload for Development
```sh
npm run dev
```

### Compile and Minify for Production
```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)
```sh
npm run lint
```

### Scaffold
#### State Management
This template comes with a global state manager. You can access its data from anywhere in the project. There is no library to handle state management (like Redux or Pinia) : it is just an exported Vue `reactive` object that contains the state of our app.

It is located inside `src/store/index.js` :
```js
import { reactive } from 'vue'

const store = reactive({
    isExperienceStarted: false,
    difficulty: 1,
    collectibles: ['Box', 'Candle', 'Pen']
})

export default () => store
```

Then, you can retrieve it anywhere. Here is how you do it inside Vue components :
```js
import useStore from '@/store'

const store = useStore()

function onClick() {
    store.isExperienceStarted = true // You can directly mutate store data from here!
}
```

```html
<template>
    <button :click="onClick">Start the experience</button>
</template>
```

In WebGL, you can import the store anywhere to use it.
```js
import { store } from "@/store"

export default class Experience {
	constructor() {
        this.addCollectible()
    }

    addCollectible() {
        store.collectibles.push("New item") // You can directly mutate store data from here!
    }
}
```

As we can see, we are able to safely mutate store data - from both Vue components and WebGL. There is no need to dispatch actions that trigger the mutation.

#### Destructuring assignment and reactivity
Note that we loose reactivity when we proceed to destructuring assignment, unless we use Vue's `toRefs`. This results in a preservation of the reactivity chain.

This breaks reactivity :
```js
import { store } from "@/store"

const { collectibles } = store
```

While this preserves it :
```js
import { store } from "@/store"
import { toRefs } from "vue"

const { collectibles } = toRefs(store)
```

### ESLint
[...]

### Editor Config
[...]

### StyleLint
[...]

### Starter Possible Improvements
- Refactor the Camera, Helpers, and EventEmitter inside `webgl` folder
- Fix stats.js (for now, it does not work)
- Install GLSL plugin and glslify
