import { raf } from "@/utils/raf"
import { onBeforeUnmount, onMounted, inject } from "vue"

export function useRaf(cb, { webglHook = false } = {}) {
	const $webgl = inject("webgl", null)
	if (webglHook === true) webglHook = "beforeUpdate"

	onMounted(() => {
		if ($webgl && webglHook) {
			$webgl.$hooks[webglHook].watch(cb)
		} else {
			raf.add(cb)
		}
	})

	onBeforeUnmount(() => {
		if (webglHook) {
			$webgl.$hooks[webglHook].unwatch(cb)
		} else {
			raf.remove(cb)
		}
	})
}
