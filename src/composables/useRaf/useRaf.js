import { raf } from "@/utils/raf"
import { onBeforeUnmount, onMounted, inject } from "vue"

export function useRaf(cb = {}) {
	onMounted(() => {
		raf.add(cb)
	})

	onBeforeUnmount(() => {
		raf.remove(cb)
	})
}
