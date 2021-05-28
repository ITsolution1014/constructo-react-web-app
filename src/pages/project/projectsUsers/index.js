import React, { Component } from 'react'
import { Form, Table, Button, Card, Select } from 'antd'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { role, getLocation } from '../../../components/helpers'
import CustomInput from '../../../components/Input'
import UserModal from '../../../components/projectComponents/UserModal'
import WithModal from '../../../components/HOC/WithModal'
import ConfigRolesModal from '../../../components/projectComponents/ConfigRolesModal'

@connect(({ project, user }) => ({ project, user }))
@Form.create()
class UserProjects extends Component {
  state = { bolen: false, passData: '', userShowModal: false, projectCreator: false }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({ type: 'project/GET_USER_PROJECT' })
  }

  componentDidUpdate = async prevProps => {
    const {
      form,
      project: { added },
    } = this.props
    if (prevProps.project.added !== added) {
      form.setFieldsValue({ email: '' })
    }
  }

  componentWillUnmount() {
    const { match, dispatch } = this.props
    const { projectId } = match && match.params ? match.params : {}
    if (projectId !== undefined && projectId !== null && projectId !== '') {
      dispatch({ type: 'project/CLEAR_OLD_PROJECT' })
    }
  }

  componentWillReceiveProps = async prevProps => {
    const { user, project } = this.props
    const { userProjects } = project || {}
    const { authRole } = project || {}
    if (
      prevProps.project.userProjects !== userProjects ||
      prevProps.project.authRole !== authRole
    ) {
      const { userID } = userProjects || {}
      if (userID) {
        const { ID } = user || {}
        const flag = userID === ID || role(ID, authRole) === 'WRITE'
        this.setState({
          projectCreator: !flag,
        })
      } else {
        this.setState({
          projectCreator: false,
        })
      }
    }
  }

  validateEmail = (rule, value, callback) => {
    const { form } = this.props
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!value) {
      callback(() => <FormattedMessage id="project.users.err" />)
    } else if (!re.test(form.getFieldValue('email'))) {
      callback(() => <FormattedMessage id="project.modal.err2" />)
    } else {
      callback()
    }
  }

  handelSubmit = () => {
    const {
      project: { userProjects },
      form,
      dispatch,
    } = this.props
    const { users, pendingRegistrations, projectID } = userProjects || {}
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'project/ADD_USER_TO_PROJECT',
          payload: {
            email: values.email,
            Users: users,
            projectID,
            pendingRegistrations,
            project: userProjects,
          },
        })
      }
    })
  }

  setShowAddModal = () => {
    const { bolen } = this.state
    this.setState({ bolen: !bolen })
  }

  getDefaultSelect = (item, projectRoleArr) => {
    const userId = item.ID
    const res = projectRoleArr.filter(userRoles => {
      return (
        userRoles && userRoles.users && userRoles.users.length && userRoles.users.includes(userId)
      )
    })

    return res && res.length ? res[0].roleName : 'ORDINARY'
  }

  setPassData = values => this.setState({ passData: values })

  setUserShowModal = val => {
    this.setState({ userShowModal: val })
  }

  updateRoleOfUser = async (oldRole, item, newRole) => {
    const {
      project: { userProjects, authRole, projectRole },
      dispatch,
    } = this.props
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
          projectID: userProjects.projectID,
          oldRole,
          userIdToRemove: userId,
          newRole,
          userProjects,
          authRole,
          projectRole,
        },
      })
    }
  }

  render() {
    const { projectCreator } = this.state
    const {
      form,
      user: { ID: id },
      project: { authRole, projectUsersData, pendingRegistrations, loading, userProjects },
    } = this.props
    const { Option } = Select
    const tableColumns = [
      {
        title: <FormattedMessage id="projectList.name" />,
        dataIndex: 'userName',
        key: 'name',
      },
      {
        title: <FormattedMessage id="topBar.profileMenu.email" />,
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: <FormattedMessage id="topBar.profileMenu.phone" />,
        dataIndex: 'phone',
        key: 'state',
      },
      {
        title: '',
        dataIndex: 'phone',
        key: 'select',
        render: (text, data) => {
          return (
            <React.Fragment>
              {data.projectID ? (
                <Select
                  disabled={deleted || projectCreator}
                  className="drop-down"
                  defaultValue={this.getDefaultSelect(data, authRole)}
                  style={{ width: 150 }}
                  onChange={e =>
                    this.updateRoleOfUser(this.getDefaultSelect(data, authRole), data, e)
                  }
                >
                  {authRole
                    ? authRole.map(opt => {
                        return (
                          <Option key={Math.floor(Math.random() * 8485012)} value={opt.roleName}>
                            {opt.roleName}
                          </Option>
                        )
                      })
                    : null}
                </Select>
              ) : null}
            </React.Fragment>
          )
        },
      },
    ]

    const { deleted } = userProjects || {}
    let projectUserData = projectUsersData
    projectUserData =
      projectUserData &&
      projectUserData.map(item => {
        return {
          ...item,
          key: Math.floor(Math.random() * 100000),
          userName: `${item.name} ${item.surname}`,
        }
      })
    let projectPendingUsers = pendingRegistrations
    projectPendingUsers =
      projectPendingUsers &&
      projectPendingUsers.map(email => {
        return {
          email,
          key: Math.floor(Math.random() * 100000),
          userName: 'Pending...',
          phone: '',
        }
      })
    const updatedData = [...projectUserData, ...projectPendingUsers]
    const { bolen, passData, userShowModal } = this.state
    return (
      <div className="row">
        <Helmet title="Users" />
        <div className="col-lg-12">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CustomInput
                style={{ width: '300px', marginRight: '5px' }}
                placeholder="new@user.com"
                validate={(rule, value, callback) => this.validateEmail(rule, value, callback)}
                getFieldDecorator={form.getFieldDecorator}
                field="email"
                type="email"
                disable={deleted || projectCreator}
              />
              <Button
                style={{ marginTop: '3px', marginRight: '5px' }}
                loading={loading}
                disabled={deleted || projectCreator}
                onClick={this.handelSubmit}
              >
                <FormattedMessage id="project.management.modal.add" />
              </Button>
              <Button
                style={{ marginTop: '3px' }}
                disabled={deleted || projectCreator}
                onClick={this.setShowAddModal}
              >
                <FormattedMessage id="project.management.modal.configRoles" />
              </Button>
            </div>
            <Table
              // className="utils__scrollTable"
              columns={tableColumns}
              dataSource={updatedData || []}
            />

            <WithModal showModal={bolen} hideModal={() => this.setShowAddModal()} userModal>
              <UserModal setUserShowModal={this.setUserShowModal} setPassData={this.setPassData} />
            </WithModal>
            <WithModal
              showModal={userShowModal}
              hideModal={() => this.setUserShowModal(false)}
              config
            >
              <ConfigRolesModal
                roles={() => role(id, authRole)}
                passData={passData}
                setUserShowModal={this.setUserShowModal}
              />
            </WithModal>
          </Card>
        </div>
      </div>
    )
  }
}

export default UserProjects
