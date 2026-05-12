import { useRef, useEffect, useState } from 'react'
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

function RetroSun() {
  return (
    <svg className={styles.retroSun} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="sun-clip"><circle cx="100" cy="100" r="95"/></clipPath>
      <g clipPath="url(#sun-clip)">
        <rect x="5" y="5"  width="190" height="18" fill="#ff2878"/>
        <rect x="5" y="26" width="190" height="15" fill="#ff4060"/>
        <rect x="5" y="44" width="190" height="14" fill="#ff6040"/>
        <rect x="5" y="61" width="190" height="13" fill="#ff8030"/>
        <rect x="5" y="77" width="190" height="12" fill="#ffa020"/>
        <rect x="5" y="92" width="190" height="11" fill="#ffb800"/>
        <rect x="5" y="106" width="190" height="10" fill="#ffd000"/>
        <rect x="5" y="119" width="190" height="9"  fill="#ffe800"/>
        <rect x="5" y="131" width="190" height="9"  fill="#fff200"/>
        <rect x="5" y="143" width="190" height="8"  fill="#fff800"/>
        <rect x="5" y="154" width="190" height="8"  fill="#ffff00"/>
        <rect x="5" y="165" width="190" height="30" fill="#ffff40"/>
      </g>
      <circle cx="100" cy="100" r="95" stroke="rgba(255,40,120,0.3)" strokeWidth="1"/>
    </svg>
  )
}

function RetroCassette() {
  return (
    <svg className={styles.retroCassette} viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="156" height="96" rx="8" fill="#0a0020" stroke="#ff2878" strokeWidth="1.5"/>
      <rect x="12" y="12" width="136" height="50" rx="4" fill="#0d0028" stroke="rgba(255,40,120,0.4)" strokeWidth="1"/>
      <circle cx="42" cy="37" r="16" fill="#060015" stroke="#ff2878" strokeWidth="1.5"/>
      <circle cx="42" cy="37" r="8"  fill="#0a001e" stroke="rgba(255,40,120,0.5)" strokeWidth="1"/>
      <circle cx="42" cy="37" r="3"  fill="#ff2878"/>
      <circle cx="118" cy="37" r="16" fill="#060015" stroke="#ff2878" strokeWidth="1.5"/>
      <circle cx="118" cy="37" r="8"  fill="#0a001e" stroke="rgba(255,40,120,0.5)" strokeWidth="1"/>
      <circle cx="118" cy="37" r="3"  fill="#ff2878"/>
      <path d="M58 37 Q80 28 102 37" stroke="rgba(255,40,120,0.6)" strokeWidth="1.5" fill="none"/>
      <rect x="65" y="70" width="30" height="6" rx="1" fill="rgba(255,40,120,0.3)"/>
      <rect x="70" y="80" width="20" height="4" rx="1" fill="rgba(255,40,120,0.2)"/>
      <text x="80" y="92" textAnchor="middle" fill="rgba(255,40,120,0.5)" fontSize="7" fontFamily="monospace">SOULPRINT</text>
    </svg>
  )
}

function RetroGlasses() {
  return (
    <svg className={styles.retroGlasses} viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="10" width="56" height="40" rx="4" fill="rgba(255,40,120,0.15)" stroke="#ff2878" strokeWidth="2"/>
      <rect x="82" y="10" width="56" height="40" rx="4" fill="rgba(255,40,120,0.15)" stroke="#ff2878" strokeWidth="2"/>
      <line x1="58" y1="25" x2="82" y2="25" stroke="#ff2878" strokeWidth="2"/>
      <line x1="0"  y1="25" x2="2"  y2="25" stroke="#ff2878" strokeWidth="2"/>
      <line x1="138" y1="25" x2="140" y2="25" stroke="#ff2878" strokeWidth="2"/>
      {[8,16,24,32,40,48].map(x => (
        <line key={x} x1={x+2} y1="12" x2={x+2} y2="48" stroke="rgba(255,40,120,0.25)" strokeWidth="1"/>
      ))}
      {[8,16,24,32,40,48].map(x => (
        <line key={x+100} x1={x+82} y1="12" x2={x+82} y2="48" stroke="rgba(255,40,120,0.25)" strokeWidth="1"/>
      ))}
    </svg>
  )
}

function RetroStars() {
  const stars = [
    {x:15, y:20, s:3}, {x:35, y:8,  s:2}, {x:60, y:15, s:4},
    {x:80, y:5,  s:2}, {x:92, y:22, s:3}, {x:8,  y:45, s:2},
    {x:45, y:35, s:2}, {x:70, y:38, s:3}, {x:88, y:50, s:2},
    {x:25, y:60, s:2}, {x:55, y:55, s:3}, {x:75, y:65, s:2},
  ]
  return (
    <svg className={styles.retroStarField} viewBox="0 0 100 80" preserveAspectRatio="xMidYMid slice">
      {stars.map((s, i) => (
        <g key={i}>
          <line x1={s.x} y1={s.y - s.s} x2={s.x} y2={s.y + s.s} stroke="rgba(255,255,255,0.6)" strokeWidth="0.5"/>
          <line x1={s.x - s.s} y1={s.y} x2={s.x + s.s} y2={s.y} stroke="rgba(255,255,255,0.6)" strokeWidth="0.5"/>
        </g>
      ))}
    </svg>
  )
}

export default function Home() {
  const mouse = useRef({ x: 0, y: 0 })
  const layer1 = useRef(null)
  const layer2 = useRef(null)
  const layer3 = useRef(null)
  const rafRef = useRef(null)
  const current = useRef({ x: 0, y: 0 })

  const error = new URLSearchParams(window.location.search).get('error')

  useEffect(() => {
    function onMouseMove(e) {
      mouse.current = {
        x: (e.clientX / window.innerWidth  - 0.5),
        y: (e.clientY / window.innerHeight - 0.5),
      }
    }

    function animate() {
      current.current.x += (mouse.current.x - current.current.x) * 0.06
      current.current.y += (mouse.current.y - current.current.y) * 0.06
      const x = current.current.x
      const y = current.current.y
      if (layer1.current) layer1.current.style.transform = `translate(${x * 40}px, ${y * 30}px)`
      if (layer2.current) layer2.current.style.transform = `translate(${x * 70}px, ${y * 50}px)`
      if (layer3.current) layer3.current.style.transform = `translate(${x * -25}px, ${y * -20}px)`
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className={styles.page}>
      {/* Static bg layers */}
      <div className={styles.horizonGlow} />
      <div className={styles.gridWrap}><div className={styles.grid} /></div>
      <div className={styles.horizonLine} />

      {/* Parallax layer 1 — sun, far back, slow */}
      <div ref={layer1} className={styles.parallaxLayer1}>
        <RetroSun />
      </div>

      {/* Parallax layer 2 — cassette + stars, mid */}
      <div ref={layer2} className={styles.parallaxLayer2}>
        <RetroStars />
        <RetroCassette />
      </div>

      {/* Parallax layer 3 — glasses, foreground, opposite direction */}
      <div ref={layer3} className={styles.parallaxLayer3}>
        <RetroGlasses />
      </div>

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
