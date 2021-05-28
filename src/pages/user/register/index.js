import React from 'react'
import { Form, Input, Icon, Button, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Phone from './Phone'
import styles from './style.module.scss'
import { firebaseAuth } from '../../../services/user'

const FormItem = Form.Item

@Form.create()
@connect(({ user }) => ({ user }))
class RegisterFormComponent extends React.Component {
  state = {
    confirmDirty: false,
    phone: '',
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

  componentWillReceiveProps(nextProps) {
    const { form, history } = this.props
    if (nextProps && nextProps.user && nextProps.user.signUp) {
      form.resetFields()
      history.push('/user/login')
    }
  }

  handleConfirmBlur = e => {
    const { value } = e.target
    const { confirmDirty } = this.state
    this.setState({
      confirmDirty: confirmDirty || !!value,
    })
  }

  handleSubmit = e => {
    const { form, dispatch } = this.props
    const { phone, captchaVerified } = this.state
    e.preventDefault()
    if (!captchaVerified) {
      notification.error({ message: 'Please verify captcha' })
      return
    }
    form.validateFields((err, values) => {
      const val = { ...values }
      val.phone = phone
      if (!err && phone) {
        dispatch({
          type: 'user/SIGN_UP',
          payload: val,
        })
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Confirm passwords that you enter is incorrect!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    const { confirmDirty } = this.state
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  validateEmail = (rule, value, callback) => {
    const { form } = this.props
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!value) {
      callback('Please input your Email!')
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
    const { phone } = this.state
    return (
      <div>
        <Helmet title="Register" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Registration Form</strong>
                  </h4>
                  <br />

                  <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [{ required: true, validator: this.validateEmail }],
                      })(
                        <Input
                          type="email"
                          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          placeholder="Email or Nickname"
                        />,
                      )}
                    </FormItem>

                    <FormItem label="Password">
                      {form.getFieldDecorator('password', {
                        initialValue: '',
                        rules: [{ required: true }, { validator: this.validateToNextPassword }],
                      })(
                        <Input
                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          type="password"
                          placeholder="Input your password"
                        />,
                      )}
                    </FormItem>

                    <FormItem label="Confirm Password">
                      {form.getFieldDecorator('confirm', {
                        initialValue: '',
                        rules: [{ required: true }, { validator: this.compareToFirstPassword }],
                      })(
                        <Input
                          type="password"
                          onBlur={this.handleConfirmBlur}
                          placeholder="Confirm  your password"
                        />,
                      )}
                    </FormItem>
                    <FormItem label="First Name">
                      {form.getFieldDecorator('firstname', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(
                        <Input
                          type="text"
                          onBlur={this.handleConfirmBlur}
                          placeholder="Enter Your First Name"
                        />,
                      )}
                    </FormItem>
                    <FormItem label="Last Name">
                      {form.getFieldDecorator('lastname', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(
                        <Input
                          type="text"
                          onBlur={this.handleConfirmBlur}
                          placeholder="Enter Your Sur Name"
                        />,
                      )}
                    </FormItem>
                    <FormItem label="Title">
                      {form.getFieldDecorator('title', { initialValue: '' })(
                        <Input
                          type="text"
                          onBlur={this.handleConfirmBlur}
                          placeholder="Enter Your Title"
                        />,
                      )}
                    </FormItem>

                    <Phone phone={phone} setPhone={phn => this.setState({ phone: phn })} />

                    <div className="mt-3 mb-3">
                      <Link to="/user/login" className="utils__link--blue utils__link--underlined">
                        Back to login
                      </Link>
                    </div>
                    <div id="recaptcha-container" />
                    <div className="form-actions">
                      <Button
                        type="primary"
                        onClick={this.handleSubmit}
                        loading={loading}
                        className="login-form-button"
                      >
                        Sign Up
                      </Button>
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

export default RegisterFormComponent
