<script setup lang="ts">
import { useWebRTCStore } from 'src/store/web-rtc'

defineProps<{
    refName: 'localVideoRef' | 'remoteVideoRef'
}>()

const webRTCStore = useWebRTCStore()
</script>

<template>
	<div class="row justify-center">
		<video
			:ref="(el) => webRTCStore[refName] = el as HTMLMediaElement"
			autoplay
			height="300px"
		/>
	</div>
</template>

<style>
	video {
		height: 300px;
	}
</style>
