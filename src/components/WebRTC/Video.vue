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
		/>
	</div>
</template>

<style>
	video {
		width: 100%;
		height: calc(100vh - 528px);
		object-fit: fill;
	}
</style>
