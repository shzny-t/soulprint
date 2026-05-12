import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env for local dev
try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch {}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { username } = req.body
  if (!username) return res.status(400).json({ error: 'Missing username' })

  const LASTFM_KEY = process.env.LASTFM_API_KEY
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let tracks
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${encodeURIComponent(username)}&period=6month&limit=30&api_key=${LASTFM_KEY}&format=json`
    const lfRes = await fetch(url)
    const lfData = await lfRes.json()
    if (lfData.error) return res.status(404).json({ error: lfData.message || 'User not found' })
    tracks = (lfData.toptracks?.track || []).slice(0, 30)
    if (!tracks.length) return res.status(404).json({ error: 'No listening history found' })
  } catch {
    return res.status(500).json({ error: 'Failed to fetch Last.fm data' })
  }

  const trackList = tracks.map((t, i) => `${i + 1}. "${t.name}" by ${t.artist?.name || t.artist}`).join('\n')

  const prompt = `You are doing a music personality reading in the style of hyper-specific, voyeuristic TikTok vibe checks — the kind that makes people screenshot and send it to their friends saying "this is literally you." You know these songs deeply: their lyrics, the emotional context, the type of person who listens to them at 2am vs. the gym vs. a long drive.

This person's top songs from the last 6 months:
${trackList}

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

QUOTE — one punchy line (12-18 words). The kind of line someone screenshots and posts with no caption. Should feel like a gut-punch observation about who this person is, not a description of their music. No quotation marks inside the value.

BODY — 3 short paragraphs, ~160 words total. This is the meshtimes-style hyper-specific vibe check. The goal is to make them feel seen in a way that's almost uncomfortable. Rules:
- Write in second person ("you"), direct and confident, like you already know them
- Be HYPER-SPECIFIC. Not "you feel things deeply" — instead: "you have a playlist you made at 1am three years ago that you still cannot listen to sober"
- Name actual songs from their list and say exactly what that song reveals — not what it sounds like, but what it means about their personality, their habits, their emotional patterns
- Paint specific scenes from their real life: what they do on a Sunday morning, how they text, what they order at a cafe, what their notes app looks like, how they act when they like someone
- Each paragraph is a different lens: (1) their everyday personality and energy, (2) how they are with people they love — friends, relationships, who they are when they care about someone, (3) a vivid life scene or "in another life you were..." image that captures their whole soul
- Do NOT use generic personality adjectives like "empathetic," "chaotic," "complex." Show, don't tell. Specific behaviors only.
- The vibe should be: warm, a little spiky, like your most perceptive friend is reading you at a sleepover

STATS — estimate 0-100 based on your knowledge of these songs: energy, valence, danceability, acousticness, chaosLevel, avgTempo (BPM number), avgPopularity.

CRITICAL: Return valid JSON only. No markdown fences. Escape any apostrophes inside strings as \\u0027. Use only ASCII double quotes for JSON structure. No special characters.

{"personalityId":"...","quote":"...","body":"...","stats":{"energy":0,"valence":0,"danceability":0,"acousticness":0,"chaosLevel":0,"avgTempo":0,"avgPopularity":0}}`

  try {
    if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY' })
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].text.trim()
    const cleaned = raw
      .replace(/['']/g, "'")
      .replace(/[""]/g, '"')
      .replace(/\r/g, '').replace(/\n/g, ' ').replace(/\t/g, ' ')
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
      .replace(/```json\s*/gi, '').replace(/```\s*/g, '')

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('No JSON found')
      parsed = JSON.parse(match[0])
    }

    res.json({ tracks, ...parsed })
  } catch (e) {
    console.error('Claude error:', e)
    res.status(500).json({ error: 'Analysis failed' })
  }
}
