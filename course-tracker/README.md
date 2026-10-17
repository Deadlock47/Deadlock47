# Courseflow — YouTube Course Tracker

React + Vite + Tailwind course tracker for the **Systems Design 2.0** playlist:
https://www.youtube.com/playlist?list=PLjTveVh7FakLdTmm42TMxbN8PvVn5g4KJ

## Run

```bash
npm install
npm run dev
```

## Generate the bundled playlist JSON

The app now reads its initial course catalog from `src/data/playlist.json`. To populate that file with all available public playlist items and durations:

1. Enable YouTube Data API v3 in [Google Cloud Console](https://console.cloud.google.com/apis/library/youtube.googleapis.com) and create an API key.
2. Set the key in your local terminal (do not commit the key).

PowerShell:

```powershell
$env:YOUTUBE_API_KEY="YOUR_KEY"
npm run fetch:playlist
```

macOS/Linux:

```bash
YOUTUBE_API_KEY="YOUR_KEY" npm run fetch:playlist
```

The script paginates through the playlist and looks up durations in batches, then writes a static JSON dataset to `src/data/playlist.json`. Restart/rebuild the frontend to use the bundled data. You only need to run this when you want to refresh the playlist catalog.

## Persistence and progress

The catalog, lesson completion, and notes are cached in browser `localStorage`. Use **Backup** to export progress to JSON. Browser storage is local to that browser profile and does not sync between devices. JSON/CSV import is also supported.

Keep your API key out of source control. Restrict it to YouTube Data API v3 and use appropriate referrer restrictions if needed. Private, deleted, region-restricted, or unavailable videos may not be returned by YouTube.

API docs: https://developers.google.com/youtube/v3/docs/playlistItems/list
