<script setup lang="ts">
import Video from './Video.vue'
import Chat from './Chat.vue'

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

let cameraOpen = true
const switchCamera = () => {
	cameraOpen ? webRTCStore.turnOffCamera() : webRTCStore.turnOnCamera()
	cameraOpen = !cameraOpen
}
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
			<div>
				<q-btn
					color="primary"
					icon="lock_open"
					no-caps
					outline
					round
					@click="webRTCStore.getUserMediaStream"
				/>
			</div>
			<div>
				<q-btn
					:icon="cameraOpen ? 'videocam_off' : 'videocam'"
					:disable="!webRTCStore.localStream"
					color="primary"
					no-caps
					outline
					round
					@click="switchCamera"
				/>
			</div>
			<div>
				<q-btn
					:disable="!webRTCStore.localStream"
					color="primary"
					icon="video_call"
					no-caps
					outline
					round
					@click="webRTCStore.connect"
				/>
			</div>
			<div>
				<q-btn
					:disable="!webRTCStore.remotePeer"
					color="primary"
					icon="call_end"
					no-caps
					outline
					round
					@click="webRTCStore.hangUp"
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
