import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PERSONALITY_TYPES } from '../services/personality'
import styles from './Callback.module.css'

const STEPS = [
  'Connecting to Last.fm...',
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

    const username = sessionStorage.getItem('lastfm_username')
    if (!username) { navigate('/'); return }

    async function run() {
      try {
        setStep(1)
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        })

        setStep(3)

        if (!res.ok) {
          const err = await res.json()
          navigate('/?error=' + encodeURIComponent(err.error || 'Analysis failed'))
          return
        }

        const data = await res.json()
        const { personalityId, quote, body, stats, tracks } = data

        setStep(4)

        const personality = PERSONALITY_TYPES.find((p) => p.id === personalityId) || PERSONALITY_TYPES[0]

        sessionStorage.setItem(
          'soultrack_result',
          JSON.stringify({
            personality,
            stats,
            description: { quote, body },
            tracks: tracks.slice(0, 8).map((t) => {
              const imgUrl = [3, 2, 1, 0]
                .map(i => t.image?.[i]?.['#text'])
                .find(u => u && !u.includes('2a96cbd8b46e442fc41c2b86b82156ab'))
                || ''
              return {
                id: t.url,
                name: t.name,
                artists: [{ name: t.artist?.name || t.artist }],
                external_urls: { spotify: t.url },
                album: { images: [null, null, { url: imgUrl }], name: '' },
              }
            }),
            profile: { display_name: username },
          })
        )

        setTimeout(() => navigate('/result'), 400)
      } catch (err) {
        console.error(err)
        navigate('/')
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
