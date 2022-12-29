<script setup lang="ts">
import { ref } from 'vue'

import { useWebRTCStore } from 'src/store/web-rtc'

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
	<q-card
		bordered
		flat
		class="column justify-between q-mt-md chat"
	>
		<q-card-section>
			<q-scroll-area class="message-area">
				<q-chat-message
					v-for="(message, index) in chatMessages.messages"
					:key="`${pcName}${index}`"
					name="local"
					:text="[message]"
					:sent="chatMessages.sent"
				/>
			</q-scroll-area>
		</q-card-section>
		<q-card-section>
			<q-input
				v-if="pcName === 'local'"
				v-model="text"
				outlined
				dense
			>
				<template #after>
					<q-btn
						:disable="!text || !webRTCStore.remotePeer"
						icon="send"
						round
						dense
						flat
						@click="send"
					/>
				</template>
			</q-input>
		</q-card-section>
	</q-card>
</template>

<style lang="scss">
	.chat {
		height: 300px;

		.message-area {
			height: calc(300px - 72px - 36px);
		}
	}
</style>
