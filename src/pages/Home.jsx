import styles from './Home.module.css'

const CLIENT_ID = '8d2dd5fbe7c84154a5dc7a9ac1df288a'
const REDIRECT_URI = 'https://soulprint-teal.vercel.app/callback'
const SCOPES = 'user-top-read user-read-private'

function loginWithSpotify() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: 'false',
  })
  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export default function Home() {
  const error = new URLSearchParams(window.location.search).get('error')

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

        {error && <p className={styles.errorMsg}>{decodeURIComponent(error)}</p>}

        <button className={styles.spotifyBtn} onClick={loginWithSpotify}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Connect with Spotify
        </button>

        <p className={styles.hint}>
          Free account works. No data is stored after your session.
        </p>
      </main>

      <div className={styles.strip}>
        <div className={styles.stripItem}><span className={styles.stripDot} />Top 30 tracks analyzed</div>
        <div className={styles.stripItem}><span className={styles.stripDot} />8 personality types</div>
        <div className={styles.stripItem}><span className={styles.stripDot} />No data stored</div>
        <div className={styles.ticker}>Soulprint</div>
      </div>
    </div>
  )
}
