<script setup lang="ts">
import Video from './Video.vue'
import Chat from './Chat.vue'

import { computed } from 'vue'

import type { PeerItem } from '../models'

import { useWebRTCStore } from 'src/store/web-rtc'
const webRTCStore = useWebRTCStore()

const peers: PeerItem[] = [
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

const buttons = computed(() => [
	{
		icon: 'lock_open',
		disable: false,
		action: webRTCStore.getUserMediaStream
	},
	{
		icon: webRTCStore.cameraOpen ? 'videocam_off' : 'videocam',
		disable: !webRTCStore.localStream,
		action: webRTCStore.switchCamera
	},
	{
		icon: 'video_call',
		disable: !webRTCStore.localStream,
		action: webRTCStore.connect
	},
	{
		icon: 'call_end',
		disable: !webRTCStore.remotePeer,
		action: webRTCStore.hangUp
	}
])
</script>

<template>
	<section class="full-width q-px-xs-none q-px-md-lg web-rtc">
		<div class="row q-col-gutter-x-md">
			<div
				v-for="{title, subtitle, refName, pcName}, index in peers"
				:key="`video${index}`"
				flat
				bordered
				class="col-12 col-md-6"
			>
				<div class="q-px-md q-px-md-none">
					<q-card class="srceen">
						<q-card-section class="q-py-sm">
							<div class="text-subtitle1">
								{{ title }}
							</div>
							<div class="text-caption">
								{{ subtitle }}
							</div>
						</q-card-section>
						<q-card-section class="q-pt-sm">
							<Video :ref-name="refName" />
							<Chat :pc-name="pcName" />
						</q-card-section>
					</q-card>
				</div>
			</div>
		</div>
		<div class="row justify-center q-col-gutter-sm q-mt-sm web-rtc__btn-section">
			<div
				v-for="{icon, disable, action } in buttons"
				:key="icon"
			>
				<q-btn
					:icon="icon"
					:disable="disable"
					color="primary"
					no-caps
					outline
					round
					@click="action"
				/>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
	.web-rtc {
		@media (max-width: $breakpoint-sm-max) {
				margin-top: 80px;
			}

		&__btn-section {

			@media (max-width: $breakpoint-sm-max) {
				position: absolute;
				top: 0;
				width: 100%;
			}

		}
	}
</style>
