import { readFileSync } from 'fs'
import { resolve } from 'path'

try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch {}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'Missing code' })

  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
  const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  })

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body: params.toString(),
  })

  const tokenData = await tokenRes.json()
  if (tokenData.error) return res.status(400).json({ error: tokenData.error_description })

  res.json({ access_token: tokenData.access_token })
}
