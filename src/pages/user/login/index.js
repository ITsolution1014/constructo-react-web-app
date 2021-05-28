import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Logo from '../../../assets/images/logo-light.png'
import styles from './style.module.scss'
import { firebaseAuth } from '../../../services/user'

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  state = {
    captchaVerified: false,
  }

  componentDidMount() {
    window.recaptchaVerifier = new firebaseAuth.RecaptchaVerifier('recaptcha-container', {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        this.setState({ captchaVerified: true })
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
        this.setState({ captchaVerified: false })
      },
    })

    window.recaptchaVerifier.render().then(widgetId => {
      window.recaptchaWidgetId = widgetId
    })
  }

  onSubmit = event => {
    const { captchaVerified } = this.state
    if (!captchaVerified) {
      notification.error({ message: 'Please verify captcha' })
      return
    }
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
      }
    })
  }

  validateEmail = (rule, value, callback) => {
    const { form } = this.props
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!value) {
      callback('Please input your e-mail address')
    } else if (!re.test(form.getFieldValue('email'))) {
      callback('Email is Not Correct')
    } else {
      callback()
    }
  }

  render() {
    const {
      form,
      user: { loading },
    } = this.props
    return (
      <div>
        <Helmet title="Login" />
        <div className={styles.block}>
          <div className="row">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <img width={150} className="mb-4" height={100} src={Logo} alt="logo" />
            </div>
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Please log in</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [{ required: true, validator: this.validateEmail }],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label="Password">
                      {form.getFieldDecorator('password', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input your password' }],
                      })(<Input size="default" type="password" />)}
                    </Form.Item>
                    <Form.Item>
                      {form.getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(<Checkbox>Remember me</Checkbox>)}
                      <Link
                        to="/user/forgot"
                        className="utils__link--blue utils__link--underlined pull-right"
                      >
                        Forgot password?
                      </Link>
                    </Form.Item>
                    <div id="recaptcha-container" />
                    <div className="form-actions">
                      <Button
                        type="primary"
                        className="width-150 mr-4"
                        onClick={this.onSubmit}
                        loading={loading}
                      >
                        Login
                      </Button>
                      <span className="ml-3 register-link">
                        <Link to="/user/register" className="text-primary utils__link--underlined">
                          Register
                        </Link>{' '}
                        if you don&#39;t have account
                      </span>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
