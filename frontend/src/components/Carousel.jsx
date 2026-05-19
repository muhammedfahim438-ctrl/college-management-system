import { useState, useEffect, useRef } from 'react'

function Carousel() {
  const [slides, setSlides]   = useState([])
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    fetch('/api/carousel/')
      .then(r => r.json())
      .then(d => setSlides(d))
      .catch(() => setSlides([]))
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timerRef.current)
  }, [slides])

  const goTo = i => { clearInterval(timerRef.current); setCurrent(i) }
  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = () => goTo((current + 1) % slides.length)

  const fallback = [{ id:1, image_url:'https://images.unsplash.com/photo-1562774053-701939374585?w=1600', title:'' }]
  const items = slides.length > 0 ? slides : fallback

  return (
    <section id="home">
      <div className="hero-carousel">

        {/* Slides */}
        {items.map((slide, i) => (
          <div key={slide.id} style={{
            position:'absolute', inset:0,
            opacity: i === current ? 1 : 0,
            transition:'opacity .8s ease',
            pointerEvents: i === current ? 'auto' : 'none',
          }}>
            <img
              src={slide.image_url || slide.image}
              alt={slide.title || 'Campus'}
              style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }}
            />
            {/* Overlay */}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(0,30,80,.2) 0%,rgba(0,30,80,.55) 50%,rgba(0,20,60,.88) 100%)' }}></div>

            {/* Caption */}
            <div className="hc-caption">
              <div className="hc-badge">
                <i className="bi bi-patch-check-fill"></i> Est. 2011 — Premier Institution
              </div>
              <h2>
                {slide.title
                  ? slide.title
                  : <>University Arts & <span>Science College</span></>
                }
              </h2>
              <p>A premier institution in Palakkad, Kerala — dedicated to academic excellence &amp; holistic development.</p>
              <a href="#courses" className="hc-btn">
                <i className="bi bi-book-fill"></i> Explore Courses
              </a>
            </div>
          </div>
        ))}

        {/* Indicators */}
        <div style={{ position:'absolute', bottom:32, left:0, right:0, display:'flex', justifyContent:'center', gap:6, zIndex:15 }}
          className="carousel-indicators-wrap">
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? 28 : 9, height:9,
              borderRadius: i === current ? 5 : '50%',
              background: i === current ? 'var(--gold)' : 'rgba(255,255,255,.4)',
              border: `2px solid ${i === current ? 'var(--gold)' : 'rgba(255,255,255,.5)'}`,
              transition:'.3s', cursor:'pointer', padding:0,
            }} />
          ))}
        </div>

        {/* Prev */}
        <button onClick={prev} aria-label="Previous" style={{
          position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
          width:44, height:44, background:'none', border:'none',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:15, cursor:'pointer',
        }}>
          <span className="hcar-ctrl"><i className="bi bi-chevron-left"></i></span>
        </button>

        {/* Next */}
        <button onClick={next} aria-label="Next" style={{
          position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
          width:44, height:44, background:'none', border:'none',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:15, cursor:'pointer',
        }}>
          <span className="hcar-ctrl"><i className="bi bi-chevron-right"></i></span>
        </button>

        {/* Scroll hint */}
        <a href="#hero-info" className="scroll-hint">
          <i className="bi bi-chevron-double-down"></i>
          <span>Scroll</span>
        </a>

      </div>
    </section>
  )
}

export default Carousel