import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Force-load .env (overrides any empty shell vars)
try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch {}

const app = express()
app.use(express.json())

app.post('/api/analyze', async (req, res) => {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const LASTFM_KEY = process.env.LASTFM_API_KEY
  const { username } = req.body
  if (!username) return res.status(400).json({ error: 'Missing username' })

  // 1. Fetch top tracks from Last.fm
  let tracks
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${encodeURIComponent(username)}&period=6month&limit=30&api_key=${LASTFM_KEY}&format=json`
    const lfRes = await fetch(url)
    const lfData = await lfRes.json()

    if (lfData.error) {
      return res.status(404).json({ error: lfData.message || 'Last.fm user not found' })
    }

    tracks = (lfData.toptracks?.track || []).slice(0, 30)
    if (!tracks.length) {
      return res.status(404).json({ error: 'No listening history found for this user' })
    }
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch Last.fm data' })
  }

  // 2. Build track list string
  const trackList = tracks
    .map((t, i) => `${i + 1}. "${t.name}" by ${t.artist?.name || t.artist}`)
    .join('\n')

  // 3. Ask Claude to analyze
  const prompt = `You are writing a brutally accurate music personality reading. You know songs deeply — their lyrics, their genre context, what kind of person gravitates toward them, what emotional state they signal.

This person's top songs from the last 6 months on Last.fm:
${trackList}

Your job:

Pick ONE personality type from this exact list (use the exact id):
- delulu-romantic: The Romantic Idealist — lives inside music, deeply empathic, emotional, narrative thinker
- villain-era: The Sovereign Shadow — psychologically complex, high autonomy, intensity as baseline, principled
- main-pop-girl: The Synchronist — socially attuned, emotionally generous, present-focused, instinctive taste-maker
- 2am-spiral: The Liminal Mind — introspective, comfort in ambiguity, late-night philosopher, emotional archaeologist
- unhinged-academia: The Aesthetic Absolutist — analytical listener, pattern recognition, principled taste, refuses the obvious
- that-girl-delusional: The Aspirational Self — future-oriented, high self-concept, motion as identity, optimism as discipline
- cottagecore-burnout: The Pastoral Escapist — sensory sensitive, world-weary idealist, seeks the quiet, deeply imaginative
- hyperpop-menace: The Sensory Anarchist — intensity-seeking, refuses moderation, texture over melody, finds calm in chaos
- sad-indie-kid: The Melancholic Archivist — high sensitivity, memory-driven, finds beauty in grief, the observer type
- goblin-mode: The Eclectic Contrarian — cognitively restless, anti-genre, curiosity-driven, immune to trend
- industry-plant: The Cultural Mirror — culturally attuned, trend-sensitive, social listener, comfort in consensus
- midnight-romantic: The Nocturnalist — private emotional life, slow to open, deeply loyal to sound, plays the long game

Then write:

QUOTE — one short punchy line (12–18 words). Should feel like a lyric or something you'd screenshot. Reference the actual emotional territory of these songs. No quotation marks. Not generic — if you see Cigarettes After Sex and Sufjan Stevens together, say something about that. If you see Drake and Kendrick, say something about that.

BODY — 3 sentences max. Talk like you know them. Mention 2–3 actual songs by name and what that says about them — not just genre, but what the lyrics reveal, what kind of person plays this song at this volume at this hour. Be specific, a little presumptuous. Tell them something about how they handle sadness, or what they're like in a relationship, or what they're probably doing at 2am. Under 70 words. No fluff. No "based on your listening."

STATS — estimate these as percentages (0–100) based purely on your knowledge of these songs:
- energy (how kinetic/loud/intense vs calm/quiet)
- valence (how happy/uplifting vs sad/dark)
- danceability (how much of this is made for moving)
- acousticness (how much is organic/stripped vs produced/electronic)
- chaosLevel (how varied/unpredictable vs consistent)
- avgTempo (estimated average BPM as a number, not percentage)
- avgPopularity (0-100, how mainstream is this taste)

CRITICAL: Respond with valid JSON only. No markdown. No explanation. No double quotes inside string values — refer to song titles without quotation marks. No apostrophes in contractions — write "you are" not "you're", "do not" not "don't". This is essential for JSON parsing.

{
  "personalityId": "...",
  "quote": "...",
  "body": "...",
  "stats": {
    "energy": 0,
    "valence": 0,
    "danceability": 0,
    "acousticness": 0,
    "chaosLevel": 0,
    "avgTempo": 0,
    "avgPopularity": 0
  }
}`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].text.trim()
    const cleaned = raw
      .replace(/[‘’]/g, '')
      .replace(/[“”]/g, '')
      .replace(/\r/g, '')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      // fallback: extract JSON object with regex
      const match = cleaned.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('No JSON found in response')
      parsed = JSON.parse(match[0])
    }

    res.json({ tracks, ...parsed })
  } catch (e) {
    console.error('Claude error:', e)
    res.status(500).json({ error: 'Analysis failed' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`server running on :${PORT}`))
