DEVELOPMENT 5 – PROMPTS IN OPENCODE

1. In my project, there is a folder with a JS file called "songs.js". Inside this file, you will find four different genres of music, each already containing one song. Could you add three more songs to each genre so that each genre has four songs in total?

2. I would like to add the Google Font called "Lato". Besides adding it to index.html, do I also need to add it to the Vue files of my pages?

3. After selecting a song, I would like to be sent to a new page where the title of the song and the name of the artist are written in large text at the center of the page.

4. Could you make it so that after five seconds, the audio track starts playing?

5. Is there a way to have the lyrics of the song play at the same time as the audio track?

6. Instead of the song playing automatically after five seconds, could you create a button that the user must click, which then triggers the five-second countdown before playing the song?

7. If I were to give you the music video of the song, would you be able to put it in the background of the webpage while the audio track is playing?

8. I realized that I sent you both the audio track and the music video separately, but if I were to send you an MP4 file with audio included, would this make the code easier and more seamless?

9. Could you remove the width restrictions on the lyrics container and make it 90% wide? Could you also make the lyrics larger and place them at the bottom of the page?

10. After clicking the “Start Singing” button, could you make a pop-up appear that asks the user to write a username, which will be remembered throughout the whole project? There is no need for styling yet; just the functionality.

11. I see that the username is blocking the original volume button at the top right corner. Could you move the volume button to the top left corner instead?

12. Every time I rerun the project, my original username is already there. Could you make it so that every time I run the project, I can input a new username?

13. I still see that the volume button is hidden behind the username at the top right corner. Could you remove this volume button entirely, but keep the display of volume in decibels at the top left corner?

14. Could you find the file where the microphone volume in decibels is calculated?

15. Could you make it so that this value is shown at the top left corner when a song is played in the NowPlaying.vue page?

16. Could you analyze the Vue pages NowPlaying.vue and Score.vue?

17. Could you make it so that the song only plays once and, after it finishes, automatically navigates to the score page?

18. How is the score currently being calculated?

19. Yes please, using the microphone data. Also, could you show the score without “/100” and without stars?

20. I got an error in the NowPlaying.vue page.

21. I still got a score of 47 even though I muted my microphone. Why is this happening?

22. Throughout the song, the singer should receive vocal challenges to earn bonus points. These challenges should appear as pop-ups at random locations on the screen. Could you implement this system?

23. The challenges must be purely vocal, as the only input is a microphone. The project must automatically detect whether the challenge was completed. After the song finishes, could you show bonus points separately from the final score?

24. I tried the challenge system once and it was almost perfect. Could you add one extra second at the start of each challenge for reading time that does not affect the song duration?

25. Could you make it clearer whether a challenge was completed or failed by turning the pop-up green when successful and red when failed?

26. Could you keep the pop-up grey during the challenge and only change it to green or red for two seconds afterward?

27. Could you add another action button in Score.vue that allows the user to retry the song, and could you align the buttons horizontally instead of vertically?

28. I feel like the challenges are too strict. Even when I yelled during loud challenges, I did not receive bonus points. Could you make the detection less strict?

29. Does the retry button also need to be a router link?

30. After receiving a score, there are three buttons, one of which allows retrying the song, but it does not work. Could you fix this?

31. I have an “End Session” button in my project. Once pressed, the user is taken to the leaderboard page where session duration is shown. Could you also display the username next to the session duration?

32. Could you containerize the project using Docker with separate frontend, backend, and database services using Docker Compose?

33. When the project starts, prompt the user to enter a username and store it persistently so it can be reused across pages and sessions.

34. Create a PostgreSQL database service and store users with a unique UUID.

35. Add a /health endpoint to the backend API to verify container health.

36. Implement session tracking so that pressing “Start Singing” starts a timer and pressing “End Session” saves the session duration.

37. Persist session history so multiple users appear in the leaderboard, not just the most recent one.

38. Create a leaderboard page showing longest sessions, highest total score, and most challenges completed.

39. Add an admin login page protected by a password and move the password to a .env file.

40. Create an AdminControls page with two large square buttons: one for analytics charts and one for managing songs.

41. Add analytics charts using Chart.js for most played songs, most played genres, total minutes sung, and sessions by hour of day.

42. Fix chart layout spacing so titles are visible and charts do not overlap.

43. Replace the default background with a global blue gradient applied to all Vue pages.

44. Remove per-page background styles so all pages inherit the global gradient.

45. Unify button styling across the entire project.

46. Implement an arcade-style infinite song carousel with a fully opaque center song and scaled, semi-transparent side songs.

47. Ensure return buttons route correctly between genre, song selection, and now playing pages.

48. Fix NowPlaying.vue so audio and music video start simultaneously after the countdown.

49. Center the song title and artist vertically and horizontally in the now playing page.

50. Style the username pop-up to match the global background and add a yellow border.

51. Ensure input fields match button height and styling.

52. Fix challenge scoring so completed challenges after the song ends are counted.

53. Ensure logging out from admin routes returns the user to the home page.

54. Remove the old lyrics system and clean up all related logic.

55. Fix leaderboard styling and spacing.

56. Ensure all analytics data persists correctly between sessions.