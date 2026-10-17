# Courseflow — YouTube Course Tracker

React + Vite + Tailwind course tracker for https://www.youtube.com/playlist?list=PLjTveVh7FakLdTmm42TMxbN8PvVn5g4KJ

## Run

```bash
npm install
npm run dev
```

Open Import course and provide a YouTube Data API v3 key to fetch every available public playlist item. The importer follows pagination and retrieves durations in batches. JSON/CSV import is also supported. Playlist videos, progress, and notes autosave in browser localStorage; export a JSON backup to move data manually. For public deployments, restrict your API key to the YouTube Data API and your site's HTTP referrer. Private/deleted/unavailable videos may not be returned.

API docs: https://developers.google.com/youtube/v3/docs/playlistItems/list