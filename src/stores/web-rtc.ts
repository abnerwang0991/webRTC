/* eslint-disable no-undef */
import { defineStore } from 'pinia'

export const useWebRTCStore = defineStore('webRTC', {
	state: () => ({
		localVideoRef: null as unknown as HTMLMediaElement,
		remoteVideoRef: null as unknown as HTMLMediaElement,
		localStream: null as unknown as MediaStream,
		remoteStream: null as unknown as MediaStream,
		localPeer: null as unknown as RTCPeerConnection,
		remotePeer: null as unknown as RTCPeerConnection,
		datachannel: null as unknown as RTCDataChannel,
		localMessages: [] as string[],
		remoteMessages: [] as string[]
	}),

	actions: {
		// 取得本地多媒體權限
		async getUserMediaStream () {
			console.log('🚀 ~ file: web-rtc.ts:13 ~ getUserMediaStream ~ getUserMediaStream', this.localVideoRef)

			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true
				})

				this.localVideoRef.srcObject = stream
				this.localStream = stream
			} catch (e) {
				console.log('🚀 ~ file: web-rtc.ts:30 ~ start ~ e', e)
			}
		},

		/**
		 * 當 remotePeer 藉由 Signaling channel 接收到由 localPeer 傳來的 ICE candidate 時，
		 * 利用addIceCandidate將其丟給瀏覽器解析與匹配，看看這個ICE candidate 所提供的連線方式適不適合
		*/
		async onIceCandidate (pc: RTCPeerConnection, event: RTCPeerConnectionIceEvent) {
			try {
				await pc.addIceCandidate(event.candidate as RTCIceCandidate)
			} catch (e) {
				console.log('🚀 ~ file: web-rtc.ts:33 ~ onIceCandidate ~ e', e)
			}
		},

		/**
		 * 建立 RTCPeerConnection object，並綁定onicecandidate事件，
		 * 當查找到相對應的遠端端口時會做onIceCandidate callback function 進行網路資訊的共享
		*/
		buildPeerConnection (label: 'localPeer' | 'remotePeer', configuration = {}) {
			const peer = new RTCPeerConnection(configuration)
			peer.onicecandidate = (e) => this.onIceCandidate(this[label], e)
			return peer
		},

		async onLocalPeerCreateOfferSuccess (desc: RTCSessionDescriptionInit) {
			try {
				// 本地透過setLocalDescription 將 offer 設為本身的 local description，並傳給遠端
				await this.localPeer.setLocalDescription(desc)
			} catch (e) {
				console.log('🚀 ~ file: web-rtc.ts:57 ~ onLocalPeerCreateOfferSuccess ~ e', e)
			}

			try {
				// 遠端收到本地傳來的local description後，透過setRemoteDescription，將其設為remote description
				await this.remotePeer.setRemoteDescription(desc)
			} catch (e) {
				console.log('🚀 ~ file: web-rtc.ts:62 ~ onLocalPeerCreateOfferSuccess ~ e', e)
			}

			try {
				// 遠端透過createAnswer建立自己的RTCSessionDescription，來回應offer
				const answer = await this.remotePeer.createAnswer()
				await this.onRemotePeerCreateAnswerSuccess(answer)
			} catch (e) {
				console.log('🚀 ~ file: web-rtc.ts:73 ~ onLocalPeerCreateOfferSuccess ~ e', e)
			}
		},

		// 完成p2p
		async onRemotePeerCreateAnswerSuccess (desc: RTCSessionDescriptionInit) {
			try {
				// 遠端透過setLocalDescription 將 answer 設為本身的 local description，並傳給本地
				await this.remotePeer.setLocalDescription(desc)
			} catch (e) {
				console.log('🚀 ~ file: web-rtc.ts:57 ~ onRemotePeerCreateAnswerSuccess ~ e', e)
			}
			try {
				// 本地收到遠端傳來的local description後，透過setRemoteDescription，將其設為remote description
				await this.localPeer.setRemoteDescription(desc)
			} catch (e) {
				console.log('🚀 ~ file: web-rtc.ts:64 ~ onRemotePeerCreateAnswerSuccess ~ e', e)
			}
		},

		gotRemoteStream (e: RTCTrackEvent) {
			if (this.remoteVideoRef.srcObject !== e.streams[0]) {
				this.remoteVideoRef.srcObject = e.streams[0]
			}
		},

		// 模擬本地與遠端連線
		async connect () {
			const configuration = {}
			// 建立本地對遠端的連線
			this.localPeer = this.buildPeerConnection('remotePeer', configuration)
			// 將本地的多媒體資訊添加到peer連線，以便傳輸到遠端
			// this.localStream.getTracks()
			// 	.forEach((track) => this.localPeer.addTrack(track, this.localStream))
			// 建立資料傳輸通道
			this.datachannel = this.localPeer.createDataChannel('my local channel', {
				negotiated: false
			})
			// 建立遠端對本地的連線
			this.remotePeer = this.buildPeerConnection('localPeer', configuration)
			// 模擬遠端收到本地多媒體資訊，透過ontrack在remote video顯示
			this.remotePeer.ontrack = this.gotRemoteStream
			this.remotePeer.ondatachannel = this.receiveChannelCallback

			try {
				// 建立RTCSessionDescription(SDP)
				const offer = await this.localPeer.createOffer({
					offerToReceiveAudio: true,
					offerToReceiveVideo: true
				})
				await this.onLocalPeerCreateOfferSuccess(offer)
			} catch (e) {
				console.log('🚀 ~ file: web-rtc.ts:67 ~ call ~ e', e)
			}
		},

		receiveChannelCallback (event: RTCDataChannelEvent) {
			const receiveChannel = event.channel
			receiveChannel.onmessage = (event) => {
				this.remoteMessages.push(event.data)
			}
		},

		send (data: string) {
			console.log('🚀 ~ file: web-rtc.ts:133 ~ send ~ data', data)
			this.localMessages.push(data)
			this.datachannel.send(data)
		}
	}
})
