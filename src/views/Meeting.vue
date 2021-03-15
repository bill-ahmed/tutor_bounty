<template>
  <v-container fluid style="height: 100%">
    <v-col v-if="loading">
      <p> Loading... </p>
    </v-col>

    <v-col v-else style="height: 100%; padding-bottom: 0;">
      <v-row style="height: 100%">
        <!-- Left actions -->
        <v-col cols="3" class="elevation-5 rounded">
          <h2 class="">
            {{userPosting.title}}
          </h2>
          
          <v-chip label color="primary" small> {{userPosting.category}} </v-chip>
          <br/>
          <br/>

          <p class="display-0"> {{userPosting.startDate.toLocaleString()}} • {{userPosting.duration}} </p>
        </v-col>

        <div class="mx-2"/>

        <!-- Main content -->
        <v-col class="elevation-2 rounded messagingWindow">
          <div class="nrow">
            <p class="display-1"> Chat message </p>
            <v-spacer/>
            
            <v-chip label :color="getConnectionColour()"> 
              <v-progress-circular v-if="!isConnected" :size="20" :width="3" indeterminate style="margin-right: 10px;"/>

              {{getConnectionMessage()}} 
            </v-chip>
          </div>

          <div class="nrow">
            <v-subheader style="padding: 0;"> {{meetingDetails.host.username}}, {{meetingDetails.tutor.username}} </v-subheader>
          </div>

          <v-divider/>

          <div class="nrow grow" id="messages">
            <div class="nrow" v-for="msg in messages" :key="msg.content + msg.timestamp">
              <v-spacer v-if="msg.from === $currentUser.username"/>

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

          <div class="nrow" style="padding: 0 50px;">
            <v-textarea v-model="message" rows="1" required autofocus outlined type="text" placeholder="Enter a message..." hint="Shift + Enter for more lines."
              append-outer-icon="fa fa-paper-plane"
              @click:append-outer="sendMessage()"
              @keydown.enter.exact="sendMessage($event)"
            ></v-textarea>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import Peer from 'peerjs';
import { isDevelopmentEnv } from '@/../shared/shared_constants';

export default {
  name: 'Meeting',
  components: {

  },

  data() {
    let meetingId = this.$route.params['id'];
    return {
      meetingId,
      meetingDetails: {},
      userPosting: {},
      peer: null,
      connection: null,
      isConnected: false,
      message: '',
      messages: [],
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

  methods: {
    getConnectionMessage() {
      if(this.error)
        return 'Error connecting!';

      if(!this.peer)
        return 'Connecting to server...'

      if(!this.isConnected)
        return `Connecting to ${this.isHost() ? 'tutor' : 'host'}...`

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

    sendMessage(e) {
      e?.preventDefault();
      e?.stopPropagation();

      if(this.message.trim() === '')
      {
        alert('Message cannot be empty!');
        return;
      }

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
        
        this.connection = this.peer.connect(this.isHost() ? meetingDetails.tutor._id : meetingDetails.host._id);
        this.connection.on('open', () => {
          console.log('Ready to talk!');
          this.isConnected = true;
        });

        this.connection.on('data', (data) => {
          this.handleMessageRecieved(data);
        })

        this.handlePeerSetup();

      } catch (error) {
        console.log('Error getting meetig details', error);
      }
    },

    handlePeerSetup() {
      this.peer.on('connection', (conn) => {
        this.isConnected = false;
        this.connection = conn;

        console.log('[PeerJS] Got peer connection: ', conn);

        let otherID = conn.peer;
        let otherExpectedID = this.isHost() ? this.meetingDetails.tutor._id : this.meetingDetails.host._id

        // Make sure unexpected user can't connect!
        if(otherID !== otherExpectedID)
        {
          console.error('Unexptected user tried to connect: ', otherID, '. Was expecting: ', otherExpectedID);
          return this.peer.disconnect();
        }

        this.connection.on('data', (data) => {
          this.handleMessageRecieved(data);
        });

        this.isConnected = true;
      });

      this.peer.on('close', () => {
        console.warn('[PeerJS] Peer no longer listening.');
      });

      this.peer.on('error', (err) => {
        this.error = err;
        console.error('[PeerJS] peer js error', err);

        // TODO: NEEDS MORE ERROR HANDLING!
        // e.g.: ID is already taken, one or both clients are disconnected, server error, etc.
      });
      
    },
    isHost() {
      return this.meetingDetails.host._id === this.$currentUser._id;
    },

    scrollToBottomOfMessages() {
      setTimeout(() => { 
        var element = document.getElementById("messages")
        element.scrollTop = element.scrollHeight; 
      }, 100)
    },
    test() {
      this.connection.send('Hello world!');
    }
  }
}
</script>

<style lang="scss" scoped>
.messagingWindow {
  padding: 10px;

  display: flex;
  flex-direction: column;
}
.display-1 {
  margin: 0;
}

.nrow {
  display: flex;
  flex-direction: row;
}
.grow {
  flex-grow: 1;
}

#messages {
  overflow-y: scroll;
  max-height: 65vh;
  display: flex;
  flex-direction: column;

  .msg_avatar {
    margin-right: 5px;
    color: white;
  }
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

  p {
    margin: 0;
    white-space: pre-line;
  }
}

.internal_message {
  color: white;
  background-color: var(--v-anchor-base);
}

.external_message {
  background-color: #E4E6EB;
}
</style>