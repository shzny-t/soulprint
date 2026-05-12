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

Pick ONE personality type from this exact list (use the exact id). Read the songs carefully — the type should feel like a genuine fit, not a guess:
- midnight-architect: Arctic Monkeys, The 1975, Tame Impala, Radiohead, Lorde energy. Thinks in long stretches. Processes life at night. Introspective, cinematic, builds entire worlds in their head.
- tender-one: HONNE, Olivia Dean, Rex Orange County, Clairo, Gracie Abrams, Novo Amor energy. Loves carefully and completely. Soft but not fragile. The one who remembers everything.
- beautiful-wreck: Olivia Rodrigo, Phoebe Bridgers, Mitski, Lana Del Rey, boygenius energy. Lives at full emotional volume. Feels everything as if it is the first time. Dramatically self-aware about it.
- devoted: Frank Ocean, SZA, Daniel Caesar, Sade, Steve Lacy, d4vd energy. Sensory, intentional, deeply loyal. Values intimacy over everything. Has a specific corner of the world that is entirely theirs.
- old-soul: The Smiths, Kate Bush, Fleetwood Mac, Joy Division, David Bowie, Joni Mitchell energy. Belongs to a different era. Romantic about the past. Has very specific and uncompromising taste.
- quiet-storm: Hozier, Sleep Token, Bon Iver, Nick Cave, Fiona Apple, Sigur Ros energy. Looks calm, is not calm. Has the most intense inner life of anyone in the room. Goes all the way in when they love something.
- seeker: Kendrick Lamar, Bjork, James Blake, FKA Twigs, Radiohead, eclectic genre-defying mixes. Follows curiosity wherever it leads. Listens to understand not just to feel. Hard to fully figure out.
- live-wire: Muse, Metallica, The Strokes, Queens of the Stone Age, Rage Against the Machine, Placebo, heavy rock energy. Runs on adrenaline. Does not do things halfway. Has been loyal to the same bands since they were 15.

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
