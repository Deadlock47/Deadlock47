import { writeFile } from 'node:fs/promises'

const playlistId = 'PLjTveVh7FakLdTmm42TMxbN8PvVn5g4KJ'
const apiKey = process.env.YOUTUBE_API_KEY
if (!apiKey) {
  console.error('Set YOUTUBE_API_KEY first. PowerShell: $env:YOUTUBE_API_KEY="your-key"')
  process.exit(1)
}

async function api(path, params) {
  const query = new URLSearchParams({ ...params, key: apiKey })
  const response = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${query}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || `YouTube API error: ${response.status}`)
  return data
}

const videos = []
let pageToken = ''
do {
  const page = await api('playlistItems', {
    part: 'snippet,contentDetails',
    playlistId,
    maxResults: '50',
    ...(pageToken ? { pageToken } : {}),
  })
  for (const item of page.items || []) {
    const id = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId
    const title = item.snippet?.title || ''
    if (!id || ['Private video', 'Deleted video'].includes(title)) continue
    videos.push({
      id,
      title,
      position: (item.snippet?.position ?? videos.length) + 1,
      url: `https://www.youtube.com/watch?v=${id}&list=${playlistId}`,
      thumbnail: item.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      description: item.snippet?.description || '',
      publishedAt: item.contentDetails?.videoPublishedAt || null,
      duration: '',
      durationSeconds: 0,
      channelTitle: item.snippet?.videoOwnerChannelTitle || '',
    })
  }
  pageToken = page.nextPageToken || ''
  console.log(`Fetched ${videos.length} playlist items...`)
} while (pageToken)

for (let i = 0; i < videos.length; i += 50) {
  const batch = videos.slice(i, i + 50)
  const detail = await api('videos', { part: 'contentDetails', id: batch.map(v => v.id).join(',') })
  const byId = new Map((detail.items || []).map(v => [v.id, v.contentDetails?.duration || '']))
  for (const video of batch) {
    video.duration = byId.get(video.id) || ''
    const m = video.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    video.durationSeconds = m ? +(m[1] || 0) * 3600 + +(m[2] || 0) * 60 + +(m[3] || 0) : 0
  }
}

const result = {
  playlistId,
  title: 'Systems Design 2.0',
  sourceUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
  fetchedAt: new Date().toISOString(),
  videoCount: videos.length,
  videos,
}
await writeFile(new URL('../src/data/playlist.json', import.meta.url), JSON.stringify(result, null, 2) + '\n')
console.log(`Wrote ${videos.length} videos to src/data/playlist.json`)
