<template>
<div>
    <div class="profile_page">

        <div class="userprofile">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                        <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">{{username}}</p>
                        <p class="subtitle is-6" v-if="islogged">@johnsmith</p>
                    </div>
                    </div>

                    <div class="content" v-if="islogged">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                    <a href="#">#css</a> <a href="#">#responsive</a>
                    <br>
                    <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                    </div>
                </div>

                
            </div>
        </div>

        <div class="userinfo" v-if="islogged">
            <div class="card">
                <b-table :data="pastBounty" :columns="columns"></b-table>
            </div>

        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'Profile',
  data() {
    return {
        username: 'Login/Signup',
        email: '',
        balance:0,
        avatar: '',
        islogged:false,
        pastBounty: [
                { 'id': 1, 'question':'how to write loop in python', 'name': 'Jesse', 'date': '2016-10-15 13:43:27', 'type': 'Ask' },
                { 'id': 2, 'question':'how to write loop in python', 'name': 'John', 'date': '2016-12-15 06:00:53', 'type': 'Ask' },
                { 'id': 3, 'question':'how to write loop in python','name': 'Tina', 'date': '2016-04-26 06:26:28', 'type': 'Answer' },
                { 'id': 4, 'question':'how to write loop in python','name': 'Clarence', 'date': '2016-04-10 10:28:46', 'type': 'Ask' },
                { 'id': 5, 'question':'how to write loop in python','name': 'Anne',  'date': '2016-12-06 14:38:38', 'type': 'Answer' }
            ],
            columns: [
                {
                    field: 'id',
                    label: 'ID',
                    width: '40',
                    numeric: true
                },
                {
                    field: 'name',
                    label: 'Name',
                },
                {
                    field: 'question',
                    label: 'Question',
                },

                {
                    field: 'date',
                    label: 'Date',
                    centered: true
                },
                {
                    field: 'type',
                    label: 'Type',
                }
            ]
     }
  },

  components:{
      //headTop,
      //userProfile,
  },

methods:{
    

}

});
</script>
