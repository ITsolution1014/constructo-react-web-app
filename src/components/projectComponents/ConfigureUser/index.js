import React, { useEffect } from 'react'
import { Button, Form, Select, notification } from 'antd'
import { connect, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import CustomInput from '../../Input'
import { getLocation } from '../../helpers'
import './ConfigureUser.scss'

const ConfigureUser = props => {
  const {
    setShowAddModal,
    form,
    dispatch,
    project,
    roles,
    currentId,
    project: { currentProject, added, projectRole, loading },
  } = props
  const { Option } = Select
  const { Users, pendingRegistrations, projectUsersData } = project || {}
  // const {dataUsers , setDataofUsers} = React.useState([])
  const [userDataa, setUserDaata] = React.useState([])
  const { projectID, deleted, userID } = currentProject || {}
  const [projectCreator, setProjectCreator] = React.useState(false)
  const [DataprojectUsers, setProjectUsers] = React.useState([])
  const [DatapendingRegistrations, setPendingRegistrations] = React.useState([])
  const userData = useSelector(state => state.user)
  useEffect(() => {
    if (pendingRegistrations || projectUsersData) {
      setProjectUsers(projectUsersData)
      setPendingRegistrations(pendingRegistrations)
    }
    if (Users) {
      setUserDaata(Users)
    }
  }, [pendingRegistrations, projectUsersData, Users])
  useEffect(() => {
    const { ID } = userData
    if (userID) {
      const flag = ID === userID || roles() === 'WRITE'
      setProjectCreator(!flag)
    } else {
      setProjectCreator(false)
    }
  }, [userData, currentProject, projectRole, pendingRegistrations, roles, userID])
  useEffect(() => {
    if (added) {
      form.setFieldsValue({ email: '' })
    }
  }, [added, projectUsersData, form])

  const validateEmail = (rule, value, callback) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!value) {
      callback(() => <FormattedMessage id="project.modal.err1" />)
    } else if (!re.test(form.getFieldValue('email'))) {
      callback(() => <FormattedMessage id="project.modal.err2" />)
    } else {
      callback()
    }
  }
  // const projectCreator = userID === userId
  const handleSubmit = () => {
    form.validateFields((err, values) => {
      if (!err && projectID && userDataa && pendingRegistrations && currentProject) {
        dispatch({
          type: 'project/ADD_USER_TO_PROJECT',
          payload: {
            email: values.email,
            Users: userDataa,
            projectID,
            pendingRegistrations,
            project: currentProject,
          },
        })
      }
    })
  }

  const getDefaultSelect = (item, projectRoleArr) => {
    const userId = item.ID
    const res = projectRoleArr.filter(userRoles => {
      return (
        userRoles && userRoles.users && userRoles.users.length && userRoles.users.includes(userId)
      )
    })
    return res && res.length ? res[0].roleName : 'ORDINARY'
  }

  const updateRoleOfUser = async (oldRole, item, newRole) => {
    const { ID: userId } = item
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    if (location) {
      dispatch({
        type: 'project/UPDATE_OLD_ROLE_USERS',
        payload: {
          projectID,
          oldRole,
          userIdToRemove: userId,
          newRole,
          currentProject,
          projectRole,
        },
      })
    }
  }

  const removePendingEmail = async email => {
    const res = await dispatch({
      type: 'project/REMOVE_PENDING_REQUEST',
      payload: { projectId: projectID, pendingEmail: email, userProjects: currentProject },
    })

    if (res && res.payload && Object.values(res.payload).length) {
      const response = await dispatch({ type: 'project/GET_PROJECT_BY_ID', payload: projectID })

      if (Object.values(response.payload).length) {
        notification.success({
          message: 'Email removed Successfully',
          description: 'Successfully remove email from Pending Emails',
        })
      }
    }
  }

  const removeUserFromProject = async userId => {
    const res = await dispatch({
      type: 'project/REMOVE_USERS_FROM_PROJECT',
      payload: { projectID, userId, currentProject },
    })
    if (res && res.payload && Object.values(res.payload).length) {
      const response = await dispatch({ type: 'project/GET_PROJECT_BY_ID', payload: projectID })

      if (Object.values(response.payload).length) {
        notification.success({
          message: 'User removed Successfully',
          description: 'Successfully remove user from this project',
        })
      }
    }
  }
  return (
    <React.Fragment>
      <div className="user-list">
        <div className="user-list-title">
          <h3 className="title-heading">
            <FormattedMessage id="project.management.users" />
          </h3>
          <span>
            <FormattedMessage id="project.management.user.desc" />
          </span>
        </div>
        <div className="new-user">
          <span className="new-user-element">
            <FormattedMessage id="project.management.modal.email" />
          </span>
          <Form>
            <CustomInput
              style={{ width: '600px' }}
              disable={deleted || currentId === '' || projectCreator}
              placeholder="new@user.com"
              validate={(rule, value, callback) => validateEmail(rule, value, callback)}
              getFieldDecorator={form.getFieldDecorator}
              field="email"
              type="email"
            />

            <Button
              disabled={deleted || currentId === '' || projectCreator}
              loading={loading}
              onClick={handleSubmit}
              className="w-80 mr-2 ml-3"
            >
              <FormattedMessage id="project.management.modal.add" />
            </Button>
            <Button
              disabled={deleted || currentId === '' || projectCreator}
              className="w-60 mr-2"
              onClick={() => setShowAddModal()}
            >
              <FormattedMessage id="project.management.modal.configRoles" />
            </Button>
          </Form>
        </div>
        <div className="user-list-box">
          <ul>
            {DataprojectUsers && currentId !== ''
              ? DataprojectUsers.map(item => {
                  return (
                    <li key={Math.floor(Math.random() * 100000)}>
                      <div className="user-name">
                        <p>{`${item.name} ${item.surname}`}</p>
                      </div>
                      <div className="user-con-btns">
                        <Select
                          className="drop-down"
                          disabled={deleted || projectCreator}
                          defaultValue={getDefaultSelect(item, projectRole)}
                          style={{ width: 150 }}
                          onChange={e =>
                            updateRoleOfUser(getDefaultSelect(item, projectRole), item, e)
                          }
                        >
                          {projectRole
                            ? projectRole.map(opt => {
                                return (
                                  <Option
                                    key={Math.floor(Math.random() * 8485012)}
                                    value={opt.roleName}
                                  >
                                    {opt.roleName}
                                  </Option>
                                )
                              })
                            : null}
                        </Select>
                        <Button
                          className="user-con-close"
                          disabled={deleted || projectCreator}
                          onClick={() => removeUserFromProject(item.ID)}
                        >
                          x
                        </Button>
                      </div>
                    </li>
                  )
                })
              : null}

            {DatapendingRegistrations && currentId !== ''
              ? DatapendingRegistrations.map(item => {
                  return (
                    <li key={Math.floor(Math.random() * 100000)}>
                      <div className="user-name">
                        <p>{item} (Pending...)</p>
                      </div>
                      <div className="user-con-btns">
                        <Button
                          className="user-con-close"
                          disabled={deleted || projectCreator}
                          onClick={() => removePendingEmail(item)}
                        >
                          x
                        </Button>
                      </div>
                    </li>
                  )
                })
              : null}
          </ul>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    project: state.project,
    user: state.user,
  }
}

export default Form.create()(connect(mapStateToProps, null)(ConfigureUser))
