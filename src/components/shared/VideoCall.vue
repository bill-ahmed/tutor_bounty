<template>
  <v-container fluid class="ncol">
    <div class="streams ncol">
      <div :class="isReady() ? 'other_stream_container' : 'hidden'">
        <v-row justify="center">
          <video autoplay class="large_stream" id="other_stream"></video>
          <v-progress-circular indeterminate v-if="waitingOnPeer" color="teal" class="other_stream_loader"></v-progress-circular>
        </v-row>
      </div>
      
      <div class="nrow" id="personal_stream_container">
        <video muted autoplay :class="isReady() ? 'small_stream' : 'medium_stream'" id="personal_stream"></video>
        <div id="personal_stream_actions" :class="isReady() ? 'small_stream_actions' : ''">
          <!-- Enable/disable audio -->
          <v-btn dark fab color="teal" @click="toggleAudio()" :small="isReady()" :loading="loading"> 
            <v-icon small> fa fa-{{audioEnabled ? 'microphone' : 'microphone-slash'}} </v-icon> 
          </v-btn>

          <!-- Enable/disable video -->
          <v-btn dark fab color="teal" @click="toggleVideo()" :small="isReady()" :loading="loading"> 
            <v-icon small> fa fa-{{videoEnabled ? 'video' : 'video-slash'}} </v-icon> 
          </v-btn>
        </div>
      </div>
    </div>
    <br/>
    <br/>

    <!-- Controls for media stream -->
    <v-row justify="center" style="flex-grow: 0;">
      <!-- Select video input -->
      <v-col cols="4">
      <v-select dense @change="useVideoInputTrack($event)"
                :items="allMediaDevices.filter(e => e.kind === 'videoinput').map(e => e.label)" 
                label="Select Webcam*">
                </v-select>
      </v-col>
    </v-row>
    
    <v-row justify="center" style="flex-grow: 0;">
      <!-- Select audio input -->
      <v-col cols="4">
      <v-select dense @change="useAudioInputTrack($event)"
                :items="allMediaDevices.filter(e => e.kind === 'audioinput').map(e => e.label)" 
                label="Select Microphone*">
                </v-select>
      </v-col>
    </v-row>

    <v-row v-if="!isReady()" justify="center">
      <v-btn @click="startVideoCall()" :loading="loading" outlined color="success">
        Join with video
      </v-btn>
    </v-row>

    <v-row v-if="!isReady()" justify="center">
      <p class="subtitle"> <br/> <i> Both <b>video and audio</b> permissions are required! </i> </p>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ['peer', 'peerId', 'isHost'],

  data() {
    return {
      loading: false,

      mediaStream: null,
      streamCall: null,

      // List of all media devices available
      allMediaDevices: [],

      // Device IDs of input streams
      videoInputStream: null,
      audioInputStream: null,
      audioOutputStream: null,

      videoEnabled: true,
      audioEnabled: true,

      waitingOnPeer: true,
    };
  },

  mounted() {
    // Request audio/video permissions
    this.requestStreamingPermissions();
  },

  beforeDestroy() {
    this.streamCall?.close();
  },

  methods: {
    async requestStreamingPermissions() {
      this.loading = true;

      try {
        // Request audio + video permissions
        await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: { 
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });

        this.allMediaDevices = await navigator.mediaDevices.enumerateDevices();

        // Choose the first audio/video stream as default
        this.videoInputStream = this.allMediaDevices.find(e => e.kind === 'videoinput').deviceId
        this.audioInputStream = this.allMediaDevices.find(e => e.kind === 'audioinput').deviceId

        this._updateMediaStream();
        
      } catch (error) {
        console.error('Failed to get media stream: ', typeof error, error);
      }

      this.loading = false;
    },

    async startVideoCall() {
      this.loading = true;

      try {
        // Render own stream
        var otherStream = document.getElementById('other_stream');
        var selfStream = document.getElementById('personal_stream');
        selfStream.srcObject = this.mediaStream;
        
        // Call the other person, and also accept calls
        this.streamCall = this.peer.call(this.peerId, this.mediaStream);
        this.streamCall.on('stream', async (stream) => {
          this.waitingOnPeer = false;
          otherStream.srcObject = stream;
        })

        this.registerHandlers();

      } catch (error) {
        console.error('Failed to connect: ', typeof error, error);
      }

      this.loading = false;
    },

    registerHandlers() {
      this.peer.on('call', (call) => {
        this.streamCall?.close();

        // Answer the call!
        this.streamCall = call;
        call.answer(this.mediaStream);

        var otherStream = document.getElementById('other_stream');

        // Event handlers for MediaStream
        this.streamCall.on('stream', async (stream) => {
          this.waitingOnPeer = false;
          otherStream.srcObject = stream;
        });

        this.streamCall.on('close', () => {
          console.log('[MediaStream] Closed!');
        });

        this.streamCall.on('error', (err) => {
          console.log('[MediaStream] Error: ', typeof err, err.type, err);
        });

        this.waitingOnPeer = false;
      });
    },

    /** Change video stream source (usually via drop-down option) */
    async useVideoInputTrack(label) {
      this.videoInputStream = this._deviceIdByLabel(label);
      await this._updateMediaStream();
    },

    /** Change audio stream source (usually via drop-down option) */
    async useAudioInputTrack(label) {
      this.audioInputStream = this._deviceIdByLabel(label);
      await this._updateMediaStream();
    },

    /** Enable/disable audio track */
    toggleAudio() {
      this.audioEnabled = !this.audioEnabled
      this._updateMediaStream();
    },
    
    /** Enable/disable video track */
    toggleVideo() {
      this.videoEnabled = !this.videoEnabled;
      this._updateMediaStream();
    },

    _deviceIdByLabel(label) {
      return this.allMediaDevices.find(e => e.label === label).deviceId;
    },

    /** Update the audio + video streams to render locally, and what is sent to the peer */
    async _updateMediaStream() {
      // Request new streams
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {exact: this.videoInputStream},
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: {
          deviceId: {exact: this.audioInputStream}
        }
      });

      // The media tracks themselves
      var audioTrack = await this.mediaStream.getAudioTracks()[0];
      var videoTrack = await this.mediaStream.getVideoTracks()[0];

      // If user doesn't want to share audio/video, disable it
      audioTrack.enabled = this.audioEnabled;
      videoTrack.enabled = this.videoEnabled;
      
      // Update local stream, to avoid weird jitter we delay the update via setTimeout(...)
      setTimeout(async () => {
        var selfStream = document.getElementById('personal_stream');

        // Update our own stream
        selfStream.srcObject = null;
        selfStream.srcObject = this.mediaStream;
        await selfStream.play();

        // Send updated audio & video tracks to peer
        this.streamCall?.peerConnection.getSenders()[0].replaceTrack(audioTrack);
        this.streamCall?.peerConnection.getSenders()[1].replaceTrack(videoTrack);
      }, 100);
    },

    isReady() {
      return this.mediaStream && this.streamCall && !this.loading;
    },
  }
}
</script>

<style lang="scss">
.subtitle {
  font-size: 11pt;
  color: rgba(0, 0, 0, 0.6);
}

.streams {
  position: relative;
  flex-grow: 1;
}

.other_stream_container {
  position: relative;

  .other_stream_loader {
    position: absolute;
    top: 45%;
  }
}


#personal_stream_container {
  position: relative;

  height: 100%;
  min-height: 125px;
  /* max-height: 125px; */

  z-index: 100;
  justify-content: center;

  #personal_stream {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  #personal_stream.small_stream {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }

  #personal_stream_actions {
    position: absolute;
    bottom: 30px;

    width: max-content;
  }

  #personal_stream_actions.small_stream_actions {
    right: 80px;
  }
}

.small_stream, .medium_stream, .large_stream {
  border-radius: 10px;
}

.large_stream {
  height: 100%;
  min-height: 300px;
  max-height: 70vh;

  max-width: 60vw;
/* 
  width: 80%;
  max-width: 800px; */

  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.medium_stream {
  height: 100%;
  min-height: 100px;
  max-height: 400px;
}

.small_stream {
  height: 100%;
  min-height: 20px;
  max-height: 125px;
}

.hidden {
  display: none;
}
</style>