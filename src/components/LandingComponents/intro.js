import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-scroll'

export default () => {
  return (
    <React.Fragment>
      <section className="hero">
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <div className="hero-content text-center">
                <h1>
                  <FormattedMessage id="landingPage.intro.head1.h1" />
                </h1>
                <p className="intro">
                  <FormattedMessage id="landingPage.intro.par" />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="down-arrow floating-arrow">
          <Link activeClass="active" to="intro" spy smooth hashSpy duration={2200}>
            <i className="fa fa-angle-down" />
          </Link>
        </div>
      </section>

      <section className="intro section-padding" id="intro">
        <div className="container">
          <div className="row">
            <div className="col-md-4 intro-feature">
              <div className="intro-icon">
                <span data-icon="&#xe033;" className="icon" />
              </div>
              <div className="intro-content">
                <h5>
                  <FormattedMessage id="landingPage.intro.head2.h5" />
                </h5>
                <p>
                  <FormattedMessage id="landingPage.intro.par2" />
                </p>
              </div>
            </div>
            <div className="col-md-4 intro-feature">
              <div className="intro-icon">
                <span data-icon="&#xe030;" className="icon" />
              </div>
              <div className="intro-content">
                <h5>
                  <FormattedMessage id="landingPage.intro.head3.h2" />
                </h5>
                <p>
                  <FormattedMessage id="landingPage.intro.par3" />
                </p>
              </div>
            </div>
            <div className="col-md-4 intro-feature">
              <div className="intro-icon">
                <span data-icon="&#xe00c;" className="icon" />
              </div>
              <div className="intro-content last">
                <h5>
                  <FormattedMessage id="landingPage.intro.head4.h5" />
                </h5>
                <p>
                  <FormattedMessage id="landingPage.intro.par4" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}
