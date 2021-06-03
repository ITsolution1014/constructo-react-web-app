import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Container, Row, Col } from 'react-bootstrap'

import appstore from '../../assets/images/appstore.png'

import devices from '../../assets/images/devices.png'

import appstoreBlack from '../../assets/images/appstore_black.png'

import macbook from '../../assets/images/macbook-pro.png'

export default () => {
  return (
    <React.Fragment>
      <section className="features section-padding" id="o-nas">
        <Container>
          <Row>
            <Col md={{ span: 5, offset: 7 }}>
              <div className="feature-list">
                <h3>
                  <FormattedMessage id="landingPage.MainIntro.head1" />
                </h3>
                <p>
                  <FormattedMessage id="landingPage.MainIntro.par1" />
                </p>
                <ul className="features-stack">
                  <li className="feature-item">
                    <div className="feature-icon">
                      <span data-icon="&#xe03e;" className="icon" />
                    </div>
                    <div className="feature-content">
                      <h5>
                        <FormattedMessage id="landingPage.MainIntro.head2" />
                      </h5>
                      <p>
                        <FormattedMessage id="landingPage.MainIntro.par2" />
                      </p>
                    </div>
                  </li>
                  <li className="feature-item">
                    <div className="feature-icon">
                      <span data-icon="&#xe020;" className="icon" />
                    </div>
                    <div className="feature-content">
                      <h5>
                        <FormattedMessage id="landingPage.MainIntro.head3" />
                      </h5>
                      <p>
                        <FormattedMessage id="landingPage.MainIntro.par3" />
                      </p>
                    </div>
                  </li>
                  <li className="feature-item">
                    <div className="feature-icon">
                      <span data-icon="&#xe04b;" className="icon" />
                    </div>
                    <div className="feature-content">
                      <h5>
                        <FormattedMessage id="landingPage.MainIntro.head4" />
                      </h5>
                      <p>
                        <FormattedMessage id="landingPage.MainIntro.par4" />
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="text-center action-btn-wrap">
                  <a href="https://app.constructo.cc/" className="btn-lading btn-large btn-fill">
                    <FormattedMessage id="landingPage.btn1" />
                  </a>
                </div>
                <div className="text-center action-btn-wrap">
                  <a href="https://itunes.apple.com/cz/app/constructo/id1287028187?l=cs&mt=8">
                    <img src={appstore} alt="appstore" />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <div className="device-showcase">
          <div className="devices">
            <div className="ipad-wrap wow fadeInUp" />
            <div className="iphone-wrap wow fadeInUp" data-wow-delay="0.4s" />
          </div>
        </div>
        <div className="responsive-feature-img">
          <img src={devices} alt="responsive devices" />
        </div>
      </section>

      <section className="features-extra section-padding" id="funkce">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="feature-list">
                <h3>
                  <FormattedMessage id="landingPage.MainIntro.head5" />
                </h3>
                <p>
                  <FormattedMessage id="landingPage.MainIntro.par5" />
                </p>
                <a
                  href="https://app.constructo.cc/"
                  className="btn-lading btn-ghost btn-accent btn-small"
                >
                  <FormattedMessage id="landingPage.btn1" />
                </a>
              </div>
              <br />
              <div>
                <a href="https://itunes.apple.com/cz/app/constructo/id1287028187?l=cs&mt=8">
                  <img src={appstoreBlack} alt="appstore" />
                </a>
              </div>
            </div>
            <div className="col-md-7">
              <div className="macbook-wrap wow fadeInRight" />
            </div>
          </div>
        </div>

        <div className="responsive-feature-img">
          <img src={macbook} alt="responsive devices" />
        </div>
      </section>

      <section className="section-padding" id="cenik">
        <div className="container">
          <div className="row">
            <Col xs={12} className="mx-auto">
              <div className="pricing pricing--rabten">
                <div className="pricing__item">
                  <div className="icon icon--home" />
                  <h3 className="pricing__title">Beta</h3>
                  <p className="pricing__sentence">∞ přístupů</p>
                  <div className="pricing__price">
                    <span className="pricing__anim pricing__anim--1">
                      0<span className="pricing__currency">Kč</span>
                    </span>
                    <span className="pricing__anim pricing__anim--2">
                      <span className="pricing__period">měsíčně</span>
                    </span>
                  </div>
                  <ul className="pricing__feature-list">
                    <li className="pricing__feature">Stavební deník</li>
                    <li className="pricing__feature">Biometrický podpis</li>
                    <li className="pricing__feature">Projektová dokumentace</li>
                    <li className="pricing__feature">Adresář</li>
                    <li className="pricing__feature">∞ projektů do začátku</li>
                    <li className="pricing__feature">∞ GB prostoru</li>
                    <li className="pricing__feature">Mobilní aplikace</li>
                  </ul>
                  <a href="https://app.constructo.cc/auth/sign/register/">
                    <button className="btn-lading btn-fill btn-large" type="button">
                      <FormattedMessage id="landingPage.btn2" />
                    </button>
                  </a>
                  <br />
                  <a href="https://itunes.apple.com/cz/app/constructo/id1287028187?l=cs&mt=8">
                    <img src={appstore} alt="appstore" />
                  </a>
                </div>
              </div>
            </Col>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}
