<script setup lang="ts">
import { useWebRTCStore } from 'stores/web-rtc'

defineProps<{
    refName: 'localVideoRef' | 'remoteVideoRef'
}>()

const webRTCStore = useWebRTCStore()
</script>

<template>
  <video
    :ref="(el) => webRTCStore[refName] = el"
    autoplay
  />
</template>
