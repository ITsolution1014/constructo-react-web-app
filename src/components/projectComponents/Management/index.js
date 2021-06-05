import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { Button } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'

import { FormattedMessage } from 'react-intl'
import Date from '../../DatePicker'
import CustomInput from '../../Input'
import WithModal from '../../HOC/WithModal'
import ConfigureUserModal from '../ConfigureUser'
import ConfigRolesModal from '../ConfigRolesModal'
import UserModal from '../UserModal'
import './management.scss'

const Management = props => {
  const {
    formHandel,
    projectId,
    roles,
    project: { currentProject, pendingRegistrations, projectUsersData },
  } = props
  const { estimatedStart, estimatedFinish, spaceLimit, spaceUsed, userLimit, userUsed, deleted } =
    currentProject || {}

  const [userShowModal, setUserShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [passData, setPassData] = useState(null)
  return (
    <React.Fragment>
      <section style={{ borderRadius: '5px' }} className="card">
        <div className="card-header">
          <div className="form-title">
            <h3>
              <FormattedMessage id="project.management.heading" />
            </h3>
            <p>
              <FormattedMessage id="project.management.desc" />
            </p>
          </div>
        </div>

        <div className="card-body">
          <Form>
            <Date
              initialValue={estimatedStart ? moment(estimatedStart.seconds * 1000) : null}
              disabled={(roles() !== 'WRITE' && projectId !== '') || deleted}
              placeholder="Start Date"
              getFieldDecorator={formHandel.getFieldDecorator}
              requiredValue
              field="estimatedStart"
              label={<FormattedMessage id="project.management.startDate" />}
            />

            <Date
              initialValue={estimatedFinish ? moment(estimatedFinish.seconds * 1000) : null}
              disabled={(roles() !== 'WRITE' && projectId !== '') || deleted}
              placeholder="End Date"
              getFieldDecorator={formHandel.getFieldDecorator}
              requiredValue
              field="estimatedFinish"
              label={<FormattedMessage id="project.management.endDate" />}
            />

            <div className="date-label" style={{ height: '34px' }}>
              <p>
                <FormattedMessage id="project.management.cloudSpace" />
              </p>
            </div>

            <div className="space-input">
              <CustomInput
                style={{ width: '32%', margin: '0px' }}
                initialValue={spaceLimit || 1}
                disable={1 < 2}
                validate={(rule, value, callback) => callback()}
                getFieldDecorator={formHandel.getFieldDecorator}
                field="spaceLimit"
                type="Text"
                placeholder="cloudSpace"
              />

              <CustomInput
                style={{ width: '32%', margin: '0px' }}
                initialValue={spaceUsed || 0}
                disable={1 < 2}
                validate={(rule, value, callback) => callback()}
                getFieldDecorator={formHandel.getFieldDecorator}
                field="spaceUsed"
                type="Text"
                placeholder="cloudSpace"
              />
              <Button disabled={1 < 2} style={{ width: '32%' }}>
                <FormattedMessage id="project.management.cloudSpacebtn" />
              </Button>
            </div>

            <div className="date-label" style={{ height: '34px' }}>
              <p style={{ color: 'rgba(0, 0, 0, 0.85)', margin: '0', marginTop: '10px' }}>
                <FormattedMessage id="project.management.userUsed" />
              </p>
            </div>

            <div className="space-input">
              <CustomInput
                style={{ width: '32%', margin: '0px' }}
                initialValue={userLimit || 0}
                disable={1 < 2}
                validate={(rule, value, callback) => callback()}
                getFieldDecorator={formHandel.getFieldDecorator}
                field="userLimit"
                type="Text"
              />
              <CustomInput
                style={{ width: '32%', margin: '0px' }}
                initialValue={userUsed || 0}
                disable={1 < 2}
                validate={(rule, value, callback) => callback()}
                getFieldDecorator={formHandel.getFieldDecorator}
                field="userUsed"
                type="Text"
              />
              <Button disabled={1 < 2} style={{ width: '32%' }}>
                <FormattedMessage id="project.management.userUsedbtn" />
              </Button>
            </div>
            <div className="user-list">
              <h3>
                <FormattedMessage id="project.management.users" />
              </h3>
              <div className="user-list-box">
                <ul className="scrollbar">
                  {projectUsersData && projectId !== ''
                    ? projectUsersData.map(item => {
                        return (
                          <li key={Math.floor(Math.random() * 100000)}>
                            {`${item.name}  ${item.surname}`}
                          </li>
                        )
                      })
                    : null}
                  {pendingRegistrations && projectId !== ''
                    ? pendingRegistrations.map(email => {
                        return (
                          <li key={Math.floor(Math.random() * 100000)}>{email} (Pending...)</li>
                        )
                      })
                    : null}
                </ul>
              </div>

              <Button className="w-100 mt-2" onClick={() => setShowConfigModal(true)}>
                <FormattedMessage id="project.management.config" />
              </Button>
            </div>
          </Form>
          <WithModal showModal={showConfigModal} hideModal={() => setShowConfigModal(false)} main>
            <ConfigureUserModal
              currentId={projectId}
              roles={roles}
              setShowAddModal={() => setShowAddModal(true)}
            />
          </WithModal>

          <WithModal showModal={showAddModal} hideModal={() => setShowAddModal(false)} userModal>
            <UserModal
              roles={roles}
              setUserShowModal={setUserShowModal}
              setPassData={setPassData}
            />
          </WithModal>

          <WithModal showModal={userShowModal} hideModal={() => setUserShowModal(false)} config>
            <ConfigRolesModal
              roles={roles}
              passData={passData}
              setUserShowModal={setUserShowModal}
            />
          </WithModal>
        </div>
      </section>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    project: state.project,
    user: state.user,
  }
}

export default connect(mapStateToProps, null)(Management)
