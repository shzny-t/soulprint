import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import styles from './Result.module.css'

function StatBar({ label, value, color }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 400)
    return () => clearTimeout(t)
  }, [value])
  return (
    <div className={styles.statRow}>
      <div className={styles.statMeta}>
        <span>{label}</span>
        <span className={styles.statVal}>{value}%</span>
      </div>
      <div className={styles.statTrack}>
        <div className={styles.statFill} style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  )
}

function VinylWheel({ tracks }) {
  const covers = tracks.slice(0, 8).map(t => t.album?.images?.[2]?.url).filter(Boolean)
  const count = covers.length || 8
  const wrapRef = useRef(null)
  const innerRef = useRef(null)
  const rotationRef = useRef(0)
  const lastAngleRef = useRef(null)
  const rafRef = useRef(null)
  const targetRotRef = useRef(0)

  function getAngleFromCenter(e) {
    const rect = wrapRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
  }

  function handleMouseMove(e) {
    const angle = getAngleFromCenter(e)
    if (lastAngleRef.current !== null) {
      let delta = angle - lastAngleRef.current
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360
      targetRotRef.current += delta * 1.4
    }
    lastAngleRef.current = angle
  }

  function handleMouseLeave() {
    lastAngleRef.current = null
  }

  useEffect(() => {
    function animate() {
      rotationRef.current += (targetRotRef.current - rotationRef.current) * 0.12
      if (innerRef.current) {
        innerRef.current.style.transform = `rotate(${rotationRef.current}deg)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      ref={wrapRef}
      className={styles.vinylWrap}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={innerRef} className={styles.vinylInner}>
        <div className={styles.vinylOuter} />
        <div className={styles.vinylGrooves} />
        <div className={styles.vinylLabel}>
          <span className={styles.vinylLabelText}>Soul<br />print</span>
        </div>
        <div className={styles.albumRing}>
          {Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * 360
            const rad = (angle * Math.PI) / 180
            const r = 162
            const cx = 184
            const cy = 184
            const x = cx + r * Math.sin(rad) - 26
            const y = cy - r * Math.cos(rad) - 26
            return covers[i] ? (
              <img key={i} src={covers[i]} className={styles.albumCover} style={{ left: x, top: y }} alt="" />
            ) : (
              <div key={i} className={styles.albumPlaceholder} style={{ left: x, top: y }} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TicketCard({ data, innerRef }) {
  const { personality, stats, description, profile } = data
  const year = new Date().getFullYear()
  return (
    <div ref={innerRef} className={styles.ticket}>
      <div className={styles.ticketHeader}>
        <span className={styles.ticketHeaderLabel}>Soulprint / Music Personality</span>
        <span className={styles.ticketHeaderDate}>{year}</span>
      </div>
      <div className={styles.ticketBody}>
        <div className={styles.ticketName}>{personality.name}</div>
        <div className={styles.ticketTagline}>"{personality.tagline}"</div>
        <hr className={styles.ticketDivider} />
        <div className={styles.ticketStats}>
          <div className={styles.ticketStat}>
            <span className={styles.ticketStatNum}>{stats.energy}%</span>
            <span className={styles.ticketStatLabel}>Energy</span>
          </div>
          <div className={styles.ticketStat}>
            <span className={styles.ticketStatNum}>{stats.valence}%</span>
            <span className={styles.ticketStatLabel}>Positivity</span>
          </div>
          <div className={styles.ticketStat}>
            <span className={styles.ticketStatNum}>{stats.chaosLevel}%</span>
            <span className={styles.ticketStatLabel}>Chaos</span>
          </div>
        </div>
        <div className={styles.ticketFooter}>
          {profile?.display_name && (
            <span className={styles.ticketUser}>@{profile.display_name}</span>
          )}
          <span className={styles.ticketUrl}>soulprint.app</span>
        </div>
        <div className={styles.barcode} />
      </div>
    </div>
  )
}

export default function Result() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const ticketRef = useRef(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('soultrack_result')
    if (!raw) { navigate('/'); return }
    setData(JSON.parse(raw))
  }, [navigate])

  if (!data) return null

  const { personality, stats, description, tracks, profile } = data

  const statColors = {
    'Positivity': `linear-gradient(90deg, var(--red), var(--amber))`,
    'Energy': `linear-gradient(90deg, var(--teal), #00a8a0)`,
    'Danceability': `linear-gradient(90deg, var(--amber), var(--red))`,
    'Acousticness': `linear-gradient(90deg, #555, var(--gray-light))`,
    'Chaos': `linear-gradient(90deg, var(--red-bright), var(--amber))`,
  }

  async function downloadTicket() {
    if (!ticketRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#111111',
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `soulprint-${personality.id}.png`
      a.click()
    } catch (e) {
      console.error(e)
    }
    setDownloading(false)
  }

  async function copyText() {
    const text = `My Soulprint result: "${personality.name}"\n\n"${personality.tagline}"\n\nEnergy ${stats.energy}% / Positivity ${stats.valence}% / Chaos ${stats.chaosLevel}%\n\nsoulprint.app`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <button className={styles.navBack} onClick={() => navigate('/')}>
          &larr; Back
        </button>
        <div className={styles.navLogo}>
          Soul<span className={styles.navLogoAccent}>print</span>
        </div>
        <div className={styles.navMeta}>Analysis complete</div>
      </nav>

      {/* Hero band */}
      <div className={styles.heroBand}>
        <div
          className={styles.heroBandBg}
          style={{ background: personality.gradient }}
        />
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroTag}>Personality type</div>
            {profile?.display_name && (
              <div className={styles.username}>{profile.display_name}</div>
            )}
            <h1 className={styles.personalityName}>{personality.name}</h1>
            <p className={styles.tagline}>{personality.tagline}</p>
          </div>
          <VinylWheel tracks={tracks} />
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left: description + stats */}
        <div className={styles.leftCol}>
          {description?.quote && (
            <div className={styles.quoteBlock}>
              <span className={styles.quoteMark}>"</span>
              <p className={styles.quoteText}>{description.quote}</p>
            </div>
          )}

          {description?.body && (
            <div className={styles.bodyText}>
              {description.body.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

        </div>

        {/* Right: stats + ticket + tracks */}
        <div className={styles.rightCol}>
          {/* Audio DNA */}
          <div>
            <div className={styles.sectionLabel}>Audio DNA</div>
            <div className={styles.statsBlock}>
              <StatBar label="Positivity" value={stats.valence} color={statColors['Positivity']} />
              <StatBar label="Energy" value={stats.energy} color={statColors['Energy']} />
              <StatBar label="Danceability" value={stats.danceability} color={statColors['Danceability']} />
              <StatBar label="Acousticness" value={stats.acousticness} color={statColors['Acousticness']} />
              <StatBar label="Chaos" value={stats.chaosLevel} color={statColors['Chaos']} />
            </div>
            <div className={styles.tempoRow}>
              <div className={styles.tempoBox}>
                <span className={styles.tempoNum}>{stats.avgTempo}</span>
                <span className={styles.tempoLabel}>Avg BPM</span>
              </div>
              <div className={styles.tempoBox}>
                <span className={styles.tempoNum}>{stats.avgPopularity}</span>
                <span className={styles.tempoLabel}>Popularity</span>
              </div>
            </div>
          </div>

          {/* Shareable ticket */}
          <div>
            <div className={styles.sectionLabel}>Shareable card</div>
            <TicketCard data={data} innerRef={ticketRef} />
            <div className={styles.actions}>
              <button className={styles.actionBtn + ' ' + styles.downloadBtn} onClick={downloadTicket} disabled={downloading}>
                {downloading ? 'Saving...' : 'Save Image'}
              </button>
              <button className={styles.actionBtn + ' ' + styles.copyBtn} onClick={copyText}>
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
          </div>

          {/* Tracks */}
          {tracks?.length > 0 && (
            <div>
              <div className={styles.sectionLabel}>Exhibit A — The Evidence</div>
              <div className={styles.tracksList}>
                {tracks.map((track, i) => (
                  <a
                    key={track.id || i}
                    href={track.external_urls?.spotify || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.trackItem}
                  >
                    <span className={styles.trackNum}>{i + 1}</span>
                    {track.album?.images?.[2]?.url ? (
                      <img src={track.album.images[2].url} alt="" className={styles.trackImg} />
                    ) : (
                      <div className={styles.trackImgPlaceholder} />
                    )}
                    <div className={styles.trackInfo}>
                      <div className={styles.trackName}>{track.name}</div>
                      <div className={styles.trackArtist}>{track.artists.map(a => a.name).join(', ')}</div>
                    </div>
                    <span className={styles.trackArrow}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <button className={styles.retakeBtn} onClick={() => navigate('/')}>
            Run again
          </button>
        </div>
      </div>
    </div>
  )
}
