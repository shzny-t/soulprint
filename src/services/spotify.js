import { generatePKCE } from '../utils/pkce'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/callback`
const SCOPES = ['user-top-read'].join(' ')

export async function initiateSpotifyLogin() {
  const { verifier, challenge } = await generatePKCE()
  sessionStorage.setItem('pkce_verifier', verifier)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCodeForToken(code) {
  const verifier = sessionStorage.getItem('pkce_verifier')

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  })

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) throw new Error('Token exchange failed')
  const data = await res.json()
  sessionStorage.setItem('spotify_token', data.access_token)
  sessionStorage.removeItem('pkce_verifier')
  return data.access_token
}

async function spotifyFetch(endpoint, token) {
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`)
  return res.json()
}

export async function getTopTracks(token) {
  const data = await spotifyFetch(
    '/me/top/tracks?time_range=short_term&limit=30',
    token
  )
  return data.items
}

export async function getAudioFeatures(token, trackIds) {
  const ids = trackIds.join(',')
  const data = await spotifyFetch(`/audio-features?ids=${ids}`, token)
  return data.audio_features.filter(Boolean)
}

export async function getUserProfile(token) {
  return spotifyFetch('/me', token)
}
