export function incrementSongPlay(title, artist) {
  if (!title || !artist) return;
  
  const key = `${title} - ${artist}`;
  const analyticsKey = 'karaoke_analytics_song_plays';
  
  const existingData = JSON.parse(localStorage.getItem(analyticsKey) || '{}');
  existingData[key] = (existingData[key] || 0) + 1;
  
  localStorage.setItem(analyticsKey, JSON.stringify(existingData));
}

export function getSongPlays() {
  const analyticsKey = 'karaoke_analytics_song_plays';
  return JSON.parse(localStorage.getItem(analyticsKey) || '{}');
}