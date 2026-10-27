/**
 * Local development server entrypoint.
 * Allows running the Express backend directly with:
 *   npm run dev
 * without requiring the Firebase Functions emulator.
 */

import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;

app.listen(PORT, () => {
  console.log(`\n🎧 Playlitfy Backend running at: http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  - GET  /api/v1/health`);
  console.log(`  - GET  /api/v1/auth/spotify`);
  console.log(`  - GET  /api/v1/auth/callback`);
  console.log(`  - GET  /api/v1/auth/me`);
  console.log(`  - GET  /api/v1/spotify/playlist?url=<spotify_url>`);
  console.log(`  - GET  /api/v1/spotify/users/:spotifyUserId/playlists`);
  console.log(`  - POST /api/v1/convert`);
  console.log(`  - GET  /api/v1/convert/link`);
  console.log(`  - GET  /api/v1/curators`);
  console.log(`  - POST /api/v1/curators/opt-in`);
  console.log(`  - GET  /api/v1/ratings/:playlistId`);
  console.log(`  - POST /api/v1/ratings/:playlistId`);
  console.log(`  - GET  /api/v1/ratings/leaderboard`);
  console.log(`  - GET  /api/v1/playlists`);
  console.log(`  - POST /api/v1/playlists`);
  console.log(`\nReady for requests from frontend.\n`);
});
