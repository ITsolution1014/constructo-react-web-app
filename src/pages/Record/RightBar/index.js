import React from 'react'
import { Form } from 'antd'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import CustomInput from '../../../components/Input'
import GoogleMap from '../../../components/projectComponents/GoogleMap'
import { handleTimeStamp } from '../../../components/helpers'

const Rightbar = ({
  formHandel,
  latitudeHandler,
  location,
  record,
  user,
  project: { currentProject },
}) => {
  const { recordDetails } = record || {}
  const { createdAt, updatedAt, userName, signed, deleted } = recordDetails || {}
  const projectUserName = currentProject && currentProject.userName
  const currentUserName = `${user.name} ${user.surname}`
  const username = (userName && userName && userName) || projectUserName || currentUserName

  return (
    <React.Fragment>
      <section style={{ minHeight: '800px' }} className="card">
        <div className="card-body">
          <Form hideRequiredMark>
            <FormattedMessage id="project.setting.userName">
              {message => (
                <CustomInput
                  style={{ margin: '0px' }}
                  initialValue={username}
                  disable
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="userName"
                  type="text"
                  placeholder={message}
                  label={message}
                />
              )}
            </FormattedMessage>

            <FormattedMessage id="project.setting.cerate">
              {message => (
                <CustomInput
                  style={{ margin: '0px' }}
                  initialValue={createdAt ? handleTimeStamp(createdAt.seconds) : ''}
                  disable
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="createdAt"
                  type="text"
                  placeholder={message}
                  label={message}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="project.setting.updated">
              {message => (
                <CustomInput
                  style={{ margin: '0px' }}
                  initialValue={updatedAt ? handleTimeStamp(updatedAt.seconds) : ''}
                  disable
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="updatedAt"
                  type="text"
                  placeholder={message}
                  label={message}
                />
              )}
            </FormattedMessage>

            <FormattedMessage id="recordDetails.delAt">
              {message => (
                <CustomInput
                  style={{ margin: '0px' }}
                  initialValue=""
                  disable
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="deletedAt"
                  type="text"
                  placeholder={message}
                  label={message}
                />
              )}
            </FormattedMessage>
          </Form>
          <div className="mt-5" style={{ width: '100%', height: '300px' }}>
            <GoogleMap
              location={location}
              latitudeHandler={latitudeHandler}
              // outPosition={location}
              signed={signed}
              deleted={deleted}
              pins={false}
            />
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user,
    project: state.project,
    record: state.record,
  }
}

export default connect(mapStateToProps, null)(Rightbar)
