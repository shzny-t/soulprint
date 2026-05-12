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
      <div className={styles.stars} />
      <div className={styles.horizonGlow} />
      <div className={styles.gridWrap}>
        <div className={styles.grid} />
      </div>
      <div className={styles.horizonLine} />

      <nav className={styles.nav}>
        <div className={styles.logo}>Soulprint</div>
        <div className={styles.navTag}>Beta / 2025</div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.eyebrow}>Music personality analysis</div>

        <h1 className={styles.title}>
          What your music<br />
          <span className={styles.titleAccent}>says about you.</span>
        </h1>

        <p className={styles.subtitle}>
          We pull your top 30 tracks from the last 6 months and give you<br />
          a reading you will either screenshot or deny.
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
      </main>

      <div className={styles.strip}>
        <div className={styles.stripItem}><span className={styles.stripDot} />Top 30 tracks analyzed</div>
        <div className={styles.stripItem}><span className={styles.stripDot} />12 personality types</div>
        <div className={styles.stripItem}><span className={styles.stripDot} />No data stored</div>
        <div className={styles.ticker}>Soulprint</div>
      </div>
    </div>
  )
}
