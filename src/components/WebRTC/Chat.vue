<script setup lang="ts">
import { ref } from 'vue'

import { useWebRTCStore } from 'stores/web-rtc'

const props = defineProps<{
    pcName: 'local' | 'remote'
}>()

const text = ref<string>('')
const webRTCStore = useWebRTCStore()
const send = () => {
	webRTCStore.send(text.value)
	text.value = ''
}

const chatMessages = {
	messages: webRTCStore[`${props.pcName}Messages` as 'localMessages' | 'remoteMessages'],
	sent: props.pcName === 'local'

}
</script>

<template>
  <div>
    <q-chat-message
      v-for="(message, index) in chatMessages.messages"
      :key="`${pcName}${index}`"
      name="local"
      :text="[message]"
      :sent="chatMessages.sent"
    />
  </div>
  <q-input
    v-if="pcName === 'local'"
    v-model="text"
    outlined
    dense
  >
    <template #after>
      <q-btn
        :disable="!text"
        icon="send"
        round
        dense
        flat
        @click="send"
      />
    </template>
  </q-input>
</template>
