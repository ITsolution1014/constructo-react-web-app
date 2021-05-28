import React, { useEffect } from 'react'
import { WOW } from 'wowjs'
import { animateScroll as scroll } from 'react-scroll'

// import logo from '../../assets/images/logo.svg'
import Nav from '../../components/LandingComponents/Nav'
import Intro from '../../components/LandingComponents/intro'
import MainIntro from '../../components/LandingComponents/MainIntro'
import Footer from '../../components/LandingComponents/Footer'

import './etline-font.css'
import './styles.css'
import './queries.css'
import './animate.min.css'

export default () => {
  const wowJs = () => {
    if (typeof window !== 'undefined') {
      const wow = new WOW()
      wow.init()
    }
  }

  useEffect(() => {
    wowJs()
  }, [])

  return (
    <div>
      <Nav />

      <Intro />

      <MainIntro />

      <section className="to-top">
        <div className="container">
          <div className="row">
            <div className="to-top-wrap">
              <button
                className="top"
                type="button"
                onClick={() => scroll.scrollToTop({ duration: 2500, smooth: true })}
              >
                <i className="fa fa-angle-up" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
