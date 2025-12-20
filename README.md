# Project description
Welcome to KaraoKey! This project is a Karaoke/Song Accuracy Tester built with Vue.js. Users will be able to select a genre consisting of different songs. once a song has been chosen, the user will be able to sing along with the song's instrumental. Throughout the song, the user will also be met with different kinds of challenges to earn or lose bonus points. Once the songs has finished, a total score will be given which will also be placed in a global leaderboard!

# Features
- Selecting a genre to see a list of available songs
- Clicking a song to play its instrumental version
- Audio playback in the browser
- (Future) Recording your own singing and receive an accuracy score
- (Future) Completing challenges during the song to earn bonus points
- (Future) Viewing total scores in a global leaderboard

# Components
- Genres.vue –-> displays all available genres and links to song lists
- Songs.vue –-> shows the list of songs for a selected genre and plays audio when clicked
- Audio Player –-> built-in HTML audio player to play selected songs
- (Future) Score Tracker –-> tracks user performance and points
- (Future) Leaderboard –-> displays top scores globally


# Used technologies
- Vue.js 3 --> for the framework of the frontend
- Vue router --> for the routing between the genres and the songs
- JavaScript --> for the logic of the project
- Node.js -->
- HTML & CSS --> for the structure and styling
- (Future) Web Audio API –-> To get the user’s voice from the microphone and process it so the app can check how accurate the singing is
- (Future) Pitchfinder & Meyda –-> To detect the pitch of the user’s voice in real time for scoring and challenges
- Recording & Audio Processing –->To let users record their singing and save it

# Used resources
- Routing in Vue.js:
    - https://router.vuejs.org/guide/essentials/dynamic-matching
    - https://blog.logrocket.com/dynamic-routing-using-vue-router
- Audio player in Vue.js:
    - https://vuejsfeed.com/blog/vue-audio-recorder-audio-recorder-and-player-vue-js-component

# Author
Bryan Ashton Sanchez Rebong (3rd year Multimedia & Creative Technology student)