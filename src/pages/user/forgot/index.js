import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@Form.create()
@connect(({ user }) => ({ user }))
class Forgot extends Component {
  componentWillReceiveProps(nextProps) {
    const { form, history } = this.props
    if (nextProps && nextProps.user && nextProps.user.reset) {
      form.resetFields()
      history.push('/user/login')
    }
  }

  handleSubmit = e => {
    const { form, dispatch } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/RESET',
          payload: values,
        })
      }
    })
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
    return (
      <div>
        <Helmet title="Forgot" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Restore Password</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [{ required: true, validator: this.validateEmail }],
                      })(<Input size="default" type="email" />)}
                    </Form.Item>
                    <div className="mb-2">
                      <Link to="/user/login" className="utils__link--blue utils__link--underlined">
                        Back to login
                      </Link>
                    </div>
                    <div className="form-actions">
                      <Button
                        type="primary"
                        className="width-150 mr-4"
                        htmlType="submit"
                        loading={loading}
                      >
                        Restore Password
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

export default Forgot
