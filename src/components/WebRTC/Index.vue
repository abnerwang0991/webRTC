<script setup lang="ts">
import Video from './Video.vue'
import Chat from './Chat.vue'

import { useWebRTCStore } from 'stores/web-rtc'
const webRTCStore = useWebRTCStore()

const peers = [
	{
		title: '本地電腦',
		subtitle: '顯示本地影像、聲音、文字',
		refName: 'localVideoRef',
		pcName: 'local'
	},
	{
		title: '遠端電腦',
		subtitle: '顯示本地傳送到該電腦的影像、聲音、文字',
		refName: 'remoteVideoRef',
		pcName: 'remote'
	}
]
</script>

<template>
  <section>
    <div class="row">
      <q-card
        v-for="{title, subtitle, refName, pcName}, index in peers"
        :key="`video${index}`"
        flat
        bordered
        class="col-5 q-mr-md"
      >
        <q-card-section>
          <div class="text-subtitle1">
            {{ title }}
          </div>
          <div class="text-caption">
            {{ subtitle }}
          </div>
          <Video :ref-name="refName" />
          <Chat :pc-name="pcName" />
        </q-card-section>
      </q-card>
    </div>
    <div class="row q-mt-md">
      <q-btn
        color="primary"
        label="get media auth"
        no-caps
        @click="webRTCStore.getUserMediaStream"
      />
      <q-btn
        color="primary"
        label="connect"
        no-caps
        @click="webRTCStore.connect"
      />
    </div>
  </section>
</template>
