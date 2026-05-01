const TITLE = 'Bula Gej'

const SPARKS = [
  ['12%', '20%'],
  ['88%', '14%'],
  ['22%', '72%'],
  ['78%', '68%'],
  ['8%', '48%'],
  ['92%', '44%'],
  ['48%', '10%'],
  ['52%', '88%'],
  ['34%', '36%'],
  ['66%', '58%']
]

function App () {
  let glyphStreak = 0

  return (
    <main className="screen showcase-screen">
      <div className="showcase-backdrop" aria-hidden="true">
        <div className="showcase-wash" />
        <div className="showcase-beam" />
        <div className="showcase-vignette" />
        <div className="showcase-orb showcase-orb-a" />
        <div className="showcase-orb showcase-orb-b" />
        <div className="showcase-orb showcase-orb-c" />
        {SPARKS.map(([left, top], sparkIndex) => (
          <span
            key={sparkIndex}
            className="showcase-spark"
            style={{ left, top, '--spark-i': sparkIndex }}
          />
        ))}
      </div>
      <div className="showcase-ring" aria-hidden="true" />
      <div className="content showcase-content">
        <h1 className="showcase-title">
          <span className="sr-only">{TITLE}</span>
          <span className="showcase-chars-outer" aria-hidden="true">
            <span className="showcase-chars-inner">
              {TITLE.split('').map((ch, i) => {
                if (ch === ' ') {
                  return <span key={i} className="showcase-space" />
                }
                const streak = glyphStreak
                glyphStreak += 1
                return (
                  <span
                    key={i}
                    className="showcase-glyph"
                    style={{ '--glyph-i': streak }}
                  >
                    {ch}
                  </span>
                )
              })}
            </span>
            <span className="showcase-scan" />
          </span>
        </h1>
      </div>
    </main>
  )
}

export default App
