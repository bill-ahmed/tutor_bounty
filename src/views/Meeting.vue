<template>
  <v-container fluid style="height: 100%">
    <v-col v-if="loading">
      <p> Loading... </p>
    </v-col>

    <v-col v-else style="height: 100%; padding-bottom: 0;">
      <v-row style="height: 100%; flex-wrap: nowrap;">
        <!-- Left actions -->
        <v-col cols="4" class="ncol rounded">
          <div id="meeting_info_container" class="n-elevation-1">
            <div class="nrow align-center">
              <v-btn icon small>
                <v-icon> fa fa-chevron-left </v-icon>
              </v-btn>

              <h2 class="">
                {{userPosting.title}}
              </h2>

              <v-chip label color="primary" small style="margin-left: 10px;"> {{userPosting.category}} </v-chip>
              <v-spacer />
            </div>
            
            <!-- Who is in this meeting -->
            <div class="nrow">
              <v-subheader style="padding: 0;"> {{meetingDetails.host.username}}, {{meetingDetails.tutor.username}} </v-subheader>
            </div>
            
            <!-- Controls + connection status -->
            <div class="nrow flex-wrap align-center">
              <v-btn outlined small @click="endMeeting()" color="error">
                End Meeting
                <v-icon right small> fa fa-sign-out-alt </v-icon>
              </v-btn>

              <v-spacer/>
              <v-chip label :color="getConnectionColour()"> 
                <v-progress-circular v-if="!isConnected && !error" :size="20" :width="3" indeterminate style="margin-right: 10px;"/>

                {{getConnectionMessage()}} 
              </v-chip>
            </div>
          </div>
          <br/>
          
          <!-- Chat messaging window -->
          <div class="ncol grow n-elevation-1" id="chat_container">
            <div class="nrow grow messagingWindow" id="messages">
              <div class="ngrow" v-if="messages.length === 0">
                  <p class="subtitle" style="margin-bottom: 50px;"> 
                    <i> No messages yet, try sending one! </i> 
                  </p>
              </div>

              <!-- Used to calculate if user has scrolled all the way to the top or not! -->
              <div id="intersection_target"/>

              <!-- Render all messages -->
              <div class="nrow" v-for="msg in messages" :key="msg.content + msg.createdAt">
                <v-spacer v-if="msg.from === $currentUser._id"/>

                <!-- Only show avatar icon for other user -->
                <v-avatar v-if="msg.from !== $currentUser._id"
                  class="msg_avatar"
                  color="primary"
                  size="40"
                >{{otherUserName.substr(0, 1).toUpperCase()}}</v-avatar>

                <div :class="msg.from === $currentUser._id ? 'internal_message' : 'external_message'">
                  <v-tooltip :left="msg.from === $currentUser._id" :right="msg.from !== $currentUser._id" style="z-index: 200;">
                    <template v-slot:activator="{ on, attrs }">
                      <p
                        v-bind="attrs"
                        v-on="on"
                      >{{msg.content}}</p>
                    </template>
                    <span>{{new Date(msg.createdAt).toLocaleString()}}</span>
                  </v-tooltip>
                </div>

                <v-spacer v-if="msg.from !== $currentUser._id"/>
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
            <VideoCall v-if="!loading" :peer="peer" :isHost="isHost()" :peerId="isHost() ? meetingDetails.tutor._id + '_' + meetingDetails._id : meetingDetails.host._id + '_' + meetingDetails._id"> </VideoCall>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <RateUser v-if="!loading" :open="ratingOpen" :ratingFor="isHost() ? meetingDetails.host.username : meetingDetails.tutor.username" :onSubmit="submitRating"/>
  </v-container>
</template>

<script>
import Peer from 'peerjs';
import { isDevelopmentEnv, MAX_USER_MESSAGE_LENGTH } from '@/../shared/shared_constants';
import VideoCall from '@/components/shared/VideoCall';
import RateUser from '@/components/meeting/RateUser';

export default {
  name: 'Meeting',
  components: {
    VideoCall,
    RateUser
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
      messagePage: -1,

      // Background check if peer is connected
      refreshInterval: null,

      // Username of other person
      otherUserName: '',

      // Detects when user scrolls to top of messages via IntersectionObserver
      scrollObserver: null,

      // Whether rating modal is open or not
      ratingOpen: false,

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
      
      if(this.message.trim().length > MAX_USER_MESSAGE_LENGTH)
      {
        alert(`Message is too long! Can not exceeed ${MAX_USER_MESSAGE_LENGTH} characters.`);
        return;
      }

      let createdAt = Date.now();
      let newMessage = { from: this.$currentUser._id, content: this.message, createdAt }

      this.messages.push(newMessage);
      this.connection.send(newMessage);

      this.axios.post(`/meetings/${this.meetingId}/sendMessage`, { message: this.message });
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
        // Get meeting details as well as most recent messages
        let meetingDetails = await (await this.axios.get(`/meetings/${this.meetingId}`)).data
        await this.getMoreMessages();
        this.scrollToBottomOfMessages();

        var peer = new Peer(this.$currentUser._id + '_' + meetingDetails._id, {
          host: '/',
          port: isDevelopmentEnv ? 8081 : 443,
          debug: 0,
          path: '/peerjs'
        });

        this.peer = peer;

        console.log('>> My peer ID', this.$currentUser._id + '_' + meetingDetails._id);

        // Parse out important info
        meetingDetails.user_posting.startDate = new Date(meetingDetails.user_posting.startDate);
        meetingDetails.user_posting.createdAt = new Date(meetingDetails.user_posting.createdAt);

        this.meetingDetails = meetingDetails
        this.userPosting = this.meetingDetails.user_posting;
        this.otherUserName = this.isHost() ? this.meetingDetails.tutor.username : this.meetingDetails.host.username;

        console.log('>> Is Host? ', this.isHost());
        
        this.connectToPeer();
        this.connection.on('open', () => {
          console.log('Ready to talk!');
          this.isConnected = true;
        });

        this.connection.on('data', (data) => {
          this.handleMessageRecieved(data);
        });

        this.handlePeerSetup();
        this.backgroundRefresh();

        this.loading = false;

      } catch (error) {
        console.log('Error getting meeting details', error);
        this.error = { type: 'unknown' };
        this.isConnected = false;
      }

      setTimeout(this.registerDOMEvents, 500);
    },

    async getMoreMessages() {
      this.messagePage += 1;
      let messages = await (await this.axios.get(`/meetings/${this.meetingId}/messages?page=${this.messagePage}`)).data;
      
      if(messages.length > 0)
        this.messages.unshift(...messages.reverse());
      else
        this.messagePage -= 1;
    },

    /** Configure event listeners for PeerJS */
    handlePeerSetup() {
      this.peer.on('connection', (conn) => {
        let otherID = conn.peer;
        let otherExpectedID = this.isHost() ? this.meetingDetails.tutor._id : this.meetingDetails.host._id
        otherExpectedID += '_' + this.meetingDetails._id

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
      });
    },

    /** Establish a connection to other peer */
    connectToPeer() {
      console.log('>> Attempting connection to peer...');
      let hostId = this.meetingDetails.host._id + '_' + this.meetingDetails._id;
      let tutorId = this.meetingDetails.tutor._id + '_' + this.meetingDetails._id;

      console.log('connecting to', this.isHost() ? tutorId : hostId)
      this.connection = this.peer.connect(this.isHost() ? tutorId : hostId);
    },

    async submitRating(rating) {
      await this.axios.post(`/meetings/${this.meetingId}/rate`, { rating });
      this.$router.push('/dashboard', () => { window.location.reload() })
    },

    endMeeting() {
      if(confirm('Are you sure you want to end the meeting?'))
      {
        this.ratingOpen = true;
      }
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

    /* Respond to events such as scrolling messages. */
    registerDOMEvents() {
      console.log('registering DOM events!');

      // Define boundaries for what we consider to be an intersection
      let options = {
        root: document.getElementById('messages'),
        rootMargin: '100px',
        threshold: 0.1
      };

      // Listen for intersection (async)
      this.scrollObserver = new IntersectionObserver((entries) => {
        this.getMoreMessages();
      }, options);

      this.scrollObserver.observe(document.getElementById('intersection_target'));
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
  border: solid 1px rgba(0, 0, 0, 0.06);
  // box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.2), 0 0px 10px 0 rgba(0, 0, 0, 0.19);
}

#chat_container {
  border-radius: 10px;
  border: solid 1px rgba(0, 0, 0, 0.06);
  // box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

  p {
    word-wrap: break-word;
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