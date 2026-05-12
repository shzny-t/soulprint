import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PERSONALITY_TYPES } from '../services/personality'
import styles from './Callback.module.css'

const STEPS = [
  'Connecting to Spotify...',
  'Pulling top 30 tracks...',
  'Reading the room...',
  'Writing your verdict...',
  'Done.',
]

export default function Callback() {
  const navigate = useNavigate()
  const ran = useRef(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')

    if (error || !code) {
      navigate('/?error=' + encodeURIComponent(error || 'Authorization failed'))
      return
    }

    async function run() {
      try {
        setStep(1)

        // Exchange code for access token
        const tokenRes = await fetch('/api/spotify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
        const tokenData = await tokenRes.json()
        if (!tokenRes.ok) {
          navigate('/?error=' + encodeURIComponent(tokenData.error || 'Auth failed'))
          return
        }

        setStep(2)

        // Analyze with Claude
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: tokenData.access_token }),
        })

        setStep(3)

        if (!res.ok) {
          const err = await res.json()
          navigate('/?error=' + encodeURIComponent(err.error || 'Analysis failed'))
          return
        }

        const data = await res.json()
        const { personalityId, quote, body, stats, tracks, profile } = data

        setStep(4)

        const personality = PERSONALITY_TYPES.find(p => p.id === personalityId) || PERSONALITY_TYPES[0]

        sessionStorage.setItem('soultrack_result', JSON.stringify({
          personality,
          stats,
          description: { quote, body },
          tracks: (tracks || []).slice(0, 8).map(t => ({
            id: t.id,
            name: t.name,
            artists: t.artists,
            external_urls: t.external_urls,
            album: t.album,
          })),
          profile: profile || {},
        }))

        setTimeout(() => navigate('/result'), 400)
      } catch (err) {
        console.error(err)
        navigate('/?error=Something went wrong')
      }
    }

    run()
  }, [navigate])

  return (
    <div className={styles.page}>
      <div className={styles.terminal}>
        <h2 className={styles.headline}>Processing</h2>
        <p className={styles.sub}>// reading your soul — this is not a judgment-free zone</p>

        <div className={styles.termHeader}>
          <div className={styles.termDot} />
          <div className={styles.termDot} />
          <div className={styles.termDot} />
          <span className={styles.termTitle}>soulprint — analysis.exe</span>
        </div>

        <div className={styles.termBody}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={styles.termLine}
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <span className={styles.termPrompt}>&gt;</span>
              <span className={i < step ? styles.termDone : i === step ? styles.termActive : ''}>
                {s}
              </span>
              {i === step && <span className={styles.termCursor} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
