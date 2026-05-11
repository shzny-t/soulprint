import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = (e) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) return
    setLoading(true)
    sessionStorage.setItem('lastfm_username', trimmed)
    navigate('/analyzing')
  }

  return (
    <div className={styles.page}>
      <div className={styles.glowRed} />
      <div className={styles.glowTeal} />

      <nav className={styles.nav}>
        <div className={styles.logo}>Soul<span className={styles.logoAccent}>print</span></div>
        <div className={styles.navTag}>Beta / 2025</div>
      </nav>

      <main className={styles.hero}>
        {/* Left editorial column */}
        <div className={styles.heroLeft}>
          <div className={styles.eyebrow}>Music personality / Late night analysis</div>

          <h1 className={styles.title}>
            What your<br />
            <span className={styles.titleAccent}>listening history</span><br />
            says about you.
          </h1>

          <p className={styles.subtitle}>
            We pull your top 30 tracks from the last 6 months and give you a
            personality reading you will either screenshot or deny.
          </p>

          <form className={styles.form} onSubmit={handleAnalyze}>
            <div className={styles.inputWrap}>
              <span className={styles.inputPrompt}>$&gt;</span>
              <input
                className={styles.input}
                type="text"
                placeholder="enter last.fm username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
              />
              <div className={styles.cursor} />
            </div>
            <button className={styles.btn} type="submit" disabled={loading || !username.trim()}>
              {loading ? 'Loading...' : 'Run Analysis'}
            </button>
            <p className={styles.hint}>
              No Last.fm?{' '}
              <a href="https://www.last.fm/join" target="_blank" rel="noopener noreferrer" className={styles.hintLink}>
                Sign up free
              </a>{' '}
              and connect your Spotify to start tracking.
            </p>
          </form>
        </div>

        {/* Right decorative column */}
        <div className={styles.heroRight}>
          <div className={styles.filmStrip}>
            <div className={styles.filmHole} />
            <div className={styles.filmHole} />
            <div className={styles.filmHole} />
            <div className={styles.filmFrame}>
              <div className={styles.filmFrameInner}>
                <span className={styles.filmType}>The Melancholic Archivist</span>
                <span className={styles.filmYear}>2025</span>
              </div>
            </div>
            <div className={styles.filmHole} />
            <div className={styles.filmHole} />
            <div className={styles.filmHole} />
          </div>

          <div className={styles.sideText}>
            {['12 types', 'top 30 tracks', '6 months', 'no data stored'].map(t => (
              <div key={t} className={styles.sideTextItem}>{t}</div>
            ))}
          </div>
        </div>
      </main>

      <div className={styles.strip}>
        <div className={styles.stripItem}><span className={styles.stripDot} />Top 30 tracks analyzed</div>
        <div className={styles.stripItem}><span className={styles.stripDot} />12 personality types</div>
        <div className={styles.stripItem}><span className={styles.stripDot} />No data stored</div>
        <div className={styles.ticker}>SOULPRINT.APP</div>
      </div>
    </div>
  )
}
