import React from 'react'
import { Link } from 'react-scroll'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link as Anchor } from 'react-router-dom'
import logo from '../../assets/images/logo.svg'

const Nav = props => {
  const [activeToggle, setActiveToggle] = React.useState(false)

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const SwitchLang = key => {
    const { dispatch } = props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'locale',
        value: key,
      },
    })
  }

  const handleScroll = () => {
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
      document.querySelector('.navigation').classList.add('fixed')
      document.querySelector('header').style.padding = '20px 0'
      document.querySelector('.navicon').style.top = '34px'
      document.querySelector('.member-actions').style.top = '26px'
    } else {
      document.querySelector('.navigation').classList.remove('fixed')
      document.querySelector('header').style.padding = '35px 0'
      document.querySelector('.navicon').style.top = '48px'
      document.querySelector('.member-actions').style.top = '41px'
    }
  }

  const hanldeToggle = () => {
    setActiveToggle(!activeToggle)
  }

  return (
    <section className="navigation">
      <header>
        <div className="header-content">
          <div className="logo">
            <a href="#">
              <img src={logo} alt="Sedna logo" />
            </a>
          </div>
          <div className={activeToggle ? 'header-nav open' : 'header-nav'}>
            <nav>
              <ul className="primary-nav">
                <li>
                  <Link
                    activeClass="active"
                    to="o-nas"
                    spy
                    smooth
                    hashSpy
                    duration={2200}
                    onClick={hanldeToggle}
                  >
                    <FormattedMessage id="landingPage.about" />
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    to="funkce"
                    spy
                    smooth
                    hashSpy
                    duration={2200}
                    onClick={hanldeToggle}
                  >
                    <FormattedMessage id="landingPage.features" />
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    to="cenik"
                    spy
                    smooth
                    hashSpy
                    duration={2200}
                    onClick={hanldeToggle}
                  >
                    <FormattedMessage id="landingPage.pricing" />
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    to="recenze"
                    spy
                    smooth
                    hashSpy
                    duration={2200}
                    onClick={hanldeToggle}
                  >
                    <FormattedMessage id="landingPage.reviews" />
                  </Link>
                </li>
                <li>
                  <Link
                    activeClass="active"
                    to="contact"
                    spy
                    smooth
                    hashSpy
                    duration={2200}
                    onClick={hanldeToggle}
                  >
                    <FormattedMessage id="landingPage.contact" />
                  </Link>
                </li>
                <li>|</li>
                <li>
                  <Link to="" onClick={() => SwitchLang('cs-CZ')}>
                    CZ
                  </Link>
                </li>
                <li>
                  <Link to="" onClick={() => SwitchLang('en-US')}>
                    EN
                  </Link>
                </li>
              </ul>
              <ul className="member-actions">
                <li>
                  <Anchor to="/user/login" className="login">
                    <FormattedMessage id="landingPage.login" />
                  </Anchor>
                </li>
                <li>
                  <Anchor to="/user/register" className="btn-white btn-small">
                    <FormattedMessage id="landingPage.register" />
                  </Anchor>
                </li>
              </ul>
            </nav>
          </div>
          <div className="navicon">
            <button
              className={activeToggle ? 'nav-toggle active' : 'nav-toggle'}
              type="button"
              onClick={hanldeToggle}
            >
              <span />
            </button>
          </div>
        </div>
      </header>
    </section>
  )
}

export default connect(null, null)(Nav)
