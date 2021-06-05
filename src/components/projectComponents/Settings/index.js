import React, { useState } from 'react'
import { Form, Button } from 'antd'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import DeleteModal from '../DeleteModal'
import CustomInput from '../../Input'
import { handleTimeStamp } from '../../helpers'

const Setting = props => {
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const handelDeleteModal = () => setVisibleDeleteModal(!visibleDeleteModal)
  const {
    formHandel,
    roles,
    projectId,
    dispatch,
    project: { loading, currentProject },
    user: { ID },
    user,
  } = props
  const recoverProject = () => dispatch({ type: 'project/RECOVER_PROJECT', payload: { projectId } })
  const { userName, createdAt, updatedAt, active, archivedAt, deletedAt, name, deleted } =
    currentProject || {}
  const username = user ? `${user.name} ${user.surname}` : ''

  return (
    <React.Fragment>
      <section style={{ borderRadius: '5px' }} className="card">
        <div className="card-header">
          <div className="form-title">
            <h3>
              <FormattedMessage id="project.setting.heading" />
            </h3>
            <p>
              <FormattedMessage id="project.setting.desc" />
            </p>
          </div>
        </div>
        <div className="card-body">
          <Form>
            <CustomInput
              disable
              initialValue={userName || username}
              validate={(rule, value, callback) => callback()}
              getFieldDecorator={formHandel.getFieldDecorator}
              field="userName"
              type="Text"
              placeholder="Created By"
              label={<FormattedMessage id="project.setting.userName" />}
            />
            <FormattedMessage id="project.setting.cerate">
              {placeholder => (
                <CustomInput
                  disable
                  initialValue={createdAt ? handleTimeStamp(createdAt.seconds) : null}
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="createdAt"
                  type="Text"
                  placeholder={placeholder}
                  label={placeholder}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="project.setting.updated">
              {placeholder => (
                <CustomInput
                  disable
                  initialValue={updatedAt ? handleTimeStamp(updatedAt.seconds) : null}
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="updatedAt"
                  type="Text"
                  placeholder={placeholder}
                  label={placeholder}
                />
              )}
            </FormattedMessage>

            <FormattedMessage id="project.setting.active">
              {placeholder => (
                <CustomInput
                  disable
                  initialValue={
                    active || active === undefined || active === null || active === ''
                      ? 'Active'
                      : 'inActive'
                  }
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="active"
                  type="Text"
                  placeholder={placeholder}
                  label={placeholder}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="project.setting.archived">
              {placeholder => (
                <CustomInput
                  disable
                  initialValue={archivedAt || null}
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="archivedAt"
                  type="Text"
                  label={placeholder}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
            <Button
              disabled
              style={{ width: '100%', padding: '5px' }}
              className="management-form-btn"
            >
              <FormattedMessage id="project.setting.archive" />
            </Button>
            <FormattedMessage id="project.setting.deleted">
              {placeholder => (
                <CustomInput
                  disable
                  initialValue={deletedAt ? handleTimeStamp(deletedAt.seconds) : null}
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="deletedAt"
                  type="Text"
                  placeholder={placeholder}
                  label={placeholder}
                />
              )}
            </FormattedMessage>
            <DeleteModal
              handleCancel={handelDeleteModal}
              visibleDeleteModal={visibleDeleteModal}
              projectId={projectId}
              name={name}
              uid={ID}
              dispatch={dispatch}
              loading={loading}
              currentProject={currentProject}
            />
            <Button
              disabled={
                roles() !== 'WRITE' ||
                projectId === undefined ||
                projectId === null ||
                projectId === ''
              }
              loading={loading}
              onClick={deleted ? recoverProject : handelDeleteModal}
              style={{ width: '100%', padding: '5px' }}
              className="management-form-btn"
              type={deleted ? 'primary' : 'danger'}
            >
              {deleted ? (
                <FormattedMessage id="project.setting.recover" />
              ) : (
                <FormattedMessage id="project.setting.delete" />
              )}
            </Button>
          </Form>
        </div>
      </section>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user,
    project: state.project,
  }
}

export default connect(mapStateToProps, null)(Setting)
