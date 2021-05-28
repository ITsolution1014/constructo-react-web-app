import React from 'react'
import { Form, Icon, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Phone from '../register/Phone'
import CustomInput from '../../../components/Input'

import styles from './style.module.scss'
import './profiles.scss'

@Form.create()
@connect(({ user }) => ({ user }))
export default class RegisterFormComponent extends React.Component {
  state = {
    confirmDirty: false,
    phoneNumber: '',
  }

  componentDidMount() {
    const {
      user: { phone },
    } = this.props
    this.setState({ phoneNumber: phone || '' })
  }

  componentWillReceiveProps(nextProps) {
    const { history } = this.props
    if (nextProps && nextProps.user && nextProps.user.profile) {
      history.push('/dashboard')
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
    e.preventDefault()
    const {
      form,
      dispatch,
      user: { name, surname, title, phone },
    } = this.props
    const { phoneNumber } = this.state
    const valid =
      form.getFieldValue('surname') !== surname ||
      title !== form.getFieldValue('title') ||
      name !== form.getFieldValue('name') ||
      phone !== phoneNumber
    form.validateFields((err, values) => {
      const val = { ...values }
      val.phone = phoneNumber
      if (!err && valid && phoneNumber) {
        dispatch({
          type: 'user/UPDATE_PROFILE',
          payload: val,
        })
      }
    })
  }

  cancelHandler = () => {
    const {
      form,
      user: { name, surname, email, title, phone },
    } = this.props
    form.setFieldsValue({ email, name, surname, title, username: `${name}${surname}` })
    this.setState({ phoneNumber: phone })
  }

  validateName = (rule, value, callback, fieldName) => {
    const { form } = this.props

    if (!value) {
      callback(`Please input your ${fieldName}`)
    } else if (
      !/^[a-zA-Z-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðěščřžýáíéůúàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\u00C0-\u00FF]*$/.test(
        form.getFieldValue(fieldName),
      )
    ) {
      callback(`${fieldName} should contain only letters`)
    } else {
      callback()
    }
  }

  render() {
    const {
      form,
      user: { name, surname, email, title, loading },
    } = this.props
    const { phoneNumber } = this.state
    return (
      <div>
        <Helmet title="Profile" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>
                      <FormattedMessage id="topBar.profileMenu.Profile" />
                    </strong>
                  </h4>
                  <br />

                  <Form hideRequiredMark className="login-form">
                    <CustomInput
                      initialValue={email || ''}
                      disable
                      requiredValue
                      validate={(rule, value, callback) => callback()}
                      getFieldDecorator={form.getFieldDecorator}
                      field="email"
                      type="email"
                      placeholder="Email or Nickname"
                      label={<FormattedMessage id="topBar.profileMenu.email" />}
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />

                    <CustomInput
                      initialValue={name || ''}
                      validate={(rule, value, callback) =>
                        this.validateName(rule, value, callback, 'name')
                      }
                      getFieldDecorator={form.getFieldDecorator}
                      field="name"
                      type="text"
                      placeholder="Enter Your First Name"
                      label={<FormattedMessage id="user.profile.firstName" />}
                    />

                    <CustomInput
                      initialValue={surname || ''}
                      validate={(rule, value, callback) =>
                        this.validateName(rule, value, callback, 'surname')
                      }
                      getFieldDecorator={form.getFieldDecorator}
                      field="surname"
                      type="text"
                      placeholder="Enter Your Last Name"
                      label={<FormattedMessage id="user.profile.lastName" />}
                    />

                    <CustomInput
                      disable
                      initialValue={`${name} ${surname}` || ''}
                      validate={(rule, value, callback) => callback()}
                      getFieldDecorator={form.getFieldDecorator}
                      field="username"
                      type="text"
                      placeholder="Enter Your UserName"
                      label={<FormattedMessage id="user.profile.userName" />}
                    />

                    <CustomInput
                      initialValue={title || ''}
                      validate={(rule, value, callback) => callback()}
                      getFieldDecorator={form.getFieldDecorator}
                      field="title"
                      type="text"
                      placeholder="Enter Your Title"
                      label={<FormattedMessage id="user.profile.title" />}
                    />

                    <Phone
                      phone={phoneNumber}
                      setPhone={phn => this.setState({ phoneNumber: phn })}
                    />
                    <div className="form-actions">
                      <Button
                        onClick={this.handleSubmit}
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        loading={loading}
                      >
                        <FormattedMessage id="project.save" />
                      </Button>
                      <Button
                        style={{ marginLeft: '10px' }}
                        onClick={this.cancelHandler}
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        <FormattedMessage id="user.profile.cancelBtn" />
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
