<template>
  <v-container fluid style="height: 100%">
    <v-col v-if="loading">
      <p> Loading... </p>
    </v-col>

    <v-col v-else style="height: 100%; padding-bottom: 0;">
      <v-row style="height: 100%; flex-wrap: nowrap;">
        <!-- Left actions -->
        <v-col cols="4" class="ncol rounded">
          <div id="meeting_info_container">
            <div class="nrow">
              <h2 class="">
                {{userPosting.title}}
              </h2>
            </div>
            
            <!-- Who is in this meeting -->
            <div class="nrow">
              <v-subheader style="padding: 0;"> {{meetingDetails.host.username}}, {{meetingDetails.tutor.username}} </v-subheader>
            </div>
            
            <!-- User posting category + connection status -->
            <div class="nrow">
              <v-chip label color="primary" small> {{userPosting.category}} </v-chip>
              <v-spacer/>
              <v-chip label :color="getConnectionColour()"> 
                <v-progress-circular v-if="!isConnected && !error" :size="20" :width="3" indeterminate style="margin-right: 10px;"/>

                {{getConnectionMessage()}} 
              </v-chip>
            </div>
          </div>
          <br/>
          
          <!-- Chat messaging window -->
          <div class="ncol grow" id="chat_container">
            <div class="nrow grow messagingWindow" id="messages">
              <div class="ngrow" v-if="messages.length === 0">
                  <p class="subtitle" style="margin-bottom: 50px;"> 
                    <i> No messages yet, try sending one! </i> 
                  </p>
              </div>

              <!-- Render all messages -->
              <div class="nrow" v-for="msg in messages" :key="msg.content + msg.timestamp">
                <v-spacer v-if="msg.from === $currentUser.username"/>

                <!-- Only show avatar icon for other user -->
                <v-avatar v-if="msg.from !== $currentUser.username"
                  class="msg_avatar"
                  color="primary"
                  size="40"
                >{{msg.from.substr(0, 1).toUpperCase()}}</v-avatar>

                <div :class="msg.from === $currentUser.username ? 'internal_message' : 'external_message'">
                  <v-tooltip :left="msg.from === $currentUser.username" :right="msg.from !== $currentUser.username">
                    <template v-slot:activator="{ on, attrs }">
                      <p
                        v-bind="attrs"
                        v-on="on"
                      >{{msg.content}}</p>
                    </template>
                    <span>{{new Date(msg.timestamp).toLocaleString()}}</span>
                  </v-tooltip>
                </div>

                <v-spacer v-if="msg.from !== $currentUser.username"/>
              </div>
            </div>
            
            <!-- Textfield to send a new message -->
            <div class="nrow" style="padding: 0 10px;">
              <v-textarea dense v-model="message" rows="1" required autofocus outlined type="text" placeholder="Enter a message..." hint="Shift + Enter for more lines."
                append-outer-icon="fa fa-paper-plane"
                @click:append-outer="sendMessage()"
                @keydown.enter.exact="sendMessage($event)"
              ></v-textarea>
            </div>
          </div>
          <!-- <p class="display-0"> {{userPosting.startDate.toLocaleString()}} • {{userPosting.duration}} </p> -->
        </v-col>

        <div class="mx-2"/>

        <!-- Video call -->
        <v-col class="rounded">
          <div class="nrow grow" id="video_container">
            <VideoCall v-if="!loading" :peer="peer" :isHost="isHost()" :peerId="isHost() ? meetingDetails.tutor._id : meetingDetails.host._id"> </VideoCall>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import Peer from 'peerjs';
import { isDevelopmentEnv } from '@/../shared/shared_constants';
import VideoCall from '@/components/shared/VideoCall';

export default {
  name: 'Meeting',
  components: {
    VideoCall
  },

  data() {
    let meetingId = this.$route.params['id'];
    return {
      // Info about this meeting
      meetingId,
      meetingDetails: {},
      userPosting: {},
      
      // Data about connected peer
      peer: null,
      connection: null,
      isConnected: false,
      
      // The message to send & list of all messages
      message: '',
      messages: [],

      // Background check if peer is connected
      refreshInterval: null,

      loading: true,
      error: null
    }
  },

  mounted() {
    var peer = new Peer(this.$currentUser._id, {
      host: '/',
      port: isDevelopmentEnv ? 8081 : 443,
      debug: 0,
      path: '/peerjs'
    });

    this.peer = peer;
    this.getDetails();
  },

  beforeDestroy() {
    clearInterval(this.refreshInterval);
    this.connection?.close();
    this.peer?.destroy();
  },

  methods: {
    getConnectionMessage() {
      if(this.error)
        return 'Error connecting: ' + this.error.type;

      if(!this.peer)
        return 'Connecting to server...'

      if(!this.isConnected)
        return `Waiting on ${this.isHost() ? 'tutor' : 'host'}...`

      if(this.loading)
        return 'Loading...';
      
      return 'Connected';
    },
    getConnectionColour() {
      if(this.error)
        return 'error';

      if(!this.peer || !this.connection || !this.isConnected)
        return 'warning';

      return 'success'
    },

    /** Send chat message to peer */
    sendMessage(e) {
      e?.preventDefault();
      e?.stopPropagation();

      if(this.message.trim() === '')
        return;

      if(!this.isConnected)
        return alert('Need to connect first!');

      let timestamp = Date.now();
      let newMessage = { from: this.$currentUser.username, content: this.message, timestamp }
      this.messages.push(newMessage);
      this.connection.send(newMessage);
      this.message = '';

      this.scrollToBottomOfMessages();
    },

    handleMessageRecieved(message) {
      this.messages.push(message);
      this.scrollToBottomOfMessages();
    },

    /** Get information about this user meeting */
    async getDetails() {
      try {
        let meetingDetails = await (await this.axios.get(`/meetings/${this.meetingId}`)).data

        // Parse out important info
        meetingDetails.user_posting.startDate = new Date(meetingDetails.user_posting.startDate);
        meetingDetails.user_posting.createdAt = new Date(meetingDetails.user_posting.createdAt);

        this.meetingDetails = meetingDetails
        this.userPosting = this.meetingDetails.user_posting;
        this.loading = false;

        console.log('>> Is Host? ', this.isHost());
        
        this.connectToPeer();
        this.connection.on('open', () => {
          console.log('Ready to talk!');
          this.isConnected = true;
        });

        this.connection.on('data', (data) => {
          this.handleMessageRecieved(data);
        })

        this.handlePeerSetup();
        this.backgroundRefresh();

      } catch (error) {
        console.log('Error getting meeting details', error);
        this.error = { type: 'unknown' }
        this.isConnected = false;
      }
    },

    /** Configure event listeners for PeerJS */
    handlePeerSetup() {
      this.peer.on('connection', (conn) => {
        let otherID = conn.peer;
        let otherExpectedID = this.isHost() ? this.meetingDetails.tutor._id : this.meetingDetails.host._id

        // Make sure unexpected user can't connect!
        if(otherID !== otherExpectedID)
        {
          console.error('>> Unexpected user tried to connect: ', otherID, '. Was expecting: ', otherExpectedID);
          return conn.close();
        }

        this.connection = conn;
        this.connection.on('data', (data) => {
          this.handleMessageRecieved(data);
        });
      });

      this.peer.on('close', () => {
        console.warn('[PeerJS] Peer is no longer listening.');
      });

      this.peer.on('error', (err) => {
        switch (err.type) {
          case 'peer-unavailable':
            this.connectToPeer();
            break;
        
          default:
            this.error = err;
            this.isConnected = false
            break;
        }

        // TODO: NEEDS MORE ERROR HANDLING!
        // e.g.: ID is already taken, one or both clients are disconnected, server error, etc.
      });
    },

    /** Establish a connection to other peer */
    connectToPeer() {
      console.log('>> Attempting connection to peer...');
      this.connection = this.peer.connect(this.isHost() ? this.meetingDetails.tutor._id : this.meetingDetails.host._id);
    },

    /** Periodically check if peer is connected */
    backgroundRefresh() {
      this.refreshInterval = setInterval(() => {this._checkConnection()}, 1500);
    },

    isHost() {
      return this.meetingDetails.host._id === this.$currentUser._id;
    },

    /** Scroll to bottom of list of messages. Useful when adding a new message. */
    scrollToBottomOfMessages() {
      setTimeout(() => { 
        var element = document.getElementById("messages")
        element.scrollTop = element.scrollHeight; 
      }, 50)
    },

    /** Check if still connected to peer */
    _checkConnection() {
      this.isConnected = this.connection.open;
    },
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  white-space: pre-line;
}

.v-tabs {
  flex-grow: 0;
}

.v-window {
  flex-grow: 1;
}

.messagingWindow {
  padding: 10px;

  display: flex;
  flex-direction: column;
}
.display-1 {
  margin: 0;
}

.grow {
  flex-grow: 1;
}

.subtitle {
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  font-size: 10pt;
}

#meeting_info_container {
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.2), 0 0px 10px 0 rgba(0, 0, 0, 0.19);
}

#chat_container {
  border-radius: 10px;

  box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#messages {
  overflow-y: scroll;
  max-height: 55vh;
  display: flex;
  flex-direction: column;

  padding: 15px 5px;

  margin-right: 5px;
  margin-bottom: 10px;

  .msg_avatar {
    margin-right: 5px;
    color: white;
  }
}

#video_container {
  padding: 15px;
  height: 100%;
}


.internal_message, .external_message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 100px;
  min-height: 20px;

  border-radius: 7px;

  padding: 5px 10px;

  margin: 5px 0;
}

.internal_message {
  color: white;
  background-color: var(--v-anchor-base);
}

.external_message {
  background-color: #E4E6EB;
}
</style>