import React from 'react'
import { FormattedMessage } from 'react-intl'
import uni from '../../assets/images/uni.png'

export default function Footer() {
  return (
    <React.Fragment>
      <footer>
        <div id="contact" className="container">
          <div className="row">
            <div
              className="col-xs-12 col-md-6 text-center"
              style={{ color: '#eee', paddingTop: '40px', paddingBottom: '0px' }}
            >
              <img style={{ marginBottom: '20px' }} src={uni} alt="uni" />
              <br />
              <strong style={{ marginBottom: '20px' }}>
                <FormattedMessage id="landingPage.footer.head1" />
              </strong>
              <br />
              <a style={{ marginTop: '10px' }} className="btn btn-sm" href="unie.pdf">
                <FormattedMessage id="landingPage.footer.anchor" />
              </a>
            </div>
            <div
              className="col-md-6"
              style={{ color: '#eee', paddingTop: '80px', paddingBottom: '0px' }}
            >
              <div className="text-center">
                <h4 style={{ color: '#cdd1dc' }}>GONDOLA GRANITI s.r.o.</h4>
              </div>
              <table style={{ width: '100%', tableLayout: 'fixed' }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'right', paddingRight: '10px' }}>Mobilní telefon:</td>
                    <td>+420 602 342 000</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'right', paddingRight: '10px' }}>Email:</td>
                    <td>
                      <FormattedMessage id="landingPage.footer.email" />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'right', paddingRight: '10px' }}>Adresa:</td>
                    <td>Lípová 15, Praha 2, 120 00</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'right', paddingRight: '10px' }}>IČO:</td>
                    <td>25062042</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-xs-12 col-md-7">
              <div className="footer-links">
                <ul className="footer-group">
                  <li>
                    <a href="#o-nas">
                      <FormattedMessage id="landingPage.about" />
                    </a>
                  </li>
                  <li>
                    <a href="#funkce">
                      <FormattedMessage id="landingPage.features" />
                    </a>
                  </li>
                  <li>
                    <a href="#recenze">
                      <FormattedMessage id="landingPage.pricing" />
                    </a>
                  </li>
                  <li>
                    <a href="#download">
                      <FormattedMessage id="landingPage.reviews" />
                    </a>
                  </li>
                  <li>
                    <a href="https://app.constructo.cc/">
                      <FormattedMessage id="landingPage.contact" />
                    </a>
                  </li>
                </ul>
                <p>
                  <FormattedMessage id="landingPage.footer.p1" />
                </p>
              </div>
            </div>
            <div
              className="social-share"
              style={{ paddingTop: ' 320px', background: 'transparent' }}
            >
              <p>
                <FormattedMessage id="landingPage.footer.p2" />
              </p>
              <a href="http://twitter.com/constructocc" className="twitter-share">
                <i className="fa fa-twitter" />
              </a>
              <a href="https://www.facebook.com/constructo.cc/" className="facebook-share">
                <i className="fa fa-facebook" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  )
}
