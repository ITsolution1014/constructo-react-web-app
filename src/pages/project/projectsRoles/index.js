import React, { Component } from 'react'
import { Table, Button } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import ConfigRolesModal from '../../../components/projectComponents/ConfigRolesModal'
import { role } from '../../../components/helpers'

@connect(({ project, user }) => ({ project, user }))
class Roles extends Component {
  state = { filtered: '', passData: '', projectCreator: false }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({ type: 'project/GET_USER_PROJECT' })
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
      let projectRoleData = prevProps.project.authRole
      projectRoleData =
        projectRoleData &&
        projectRoleData.map(item => {
          return { ...item, key: Math.floor(Math.random() * 100000) }
        })
      this.setState({ filtered: projectRoleData, userShowModal: false })
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
    if (prevProps.project.userProject !== userProjects || prevProps.project.authRole !== authRole) {
      const { userID } = userProjects || {}
      let projectRoleData = prevProps.project.authRole
      projectRoleData =
        projectRoleData &&
        projectRoleData.map(item => {
          return { ...item, key: Math.floor(Math.random() * 100000) }
        })
      this.setState({ filtered: projectRoleData, userShowModal: false })
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

  // componentWillReceiveProps = async (prevProps) => {
  //   const {
  //     project: { authRole },
  //   } = this.props
  //   if (prevProps.project.authRole !== authRole) {
  //     let projectRoleData = prevProps.project.authRole
  //     projectRoleData =
  //       projectRoleData &&
  //       projectRoleData.map(item => {
  //         return { ...item, key: Math.floor(Math.random() * 100000) }
  //       })
  //     this.setState({ filtered: projectRoleData, userShowModal: false })
  //   }
  // }
  componentWillUnmount() {
    const { match, dispatch } = this.props
    const { projectId } = match && match.params ? match.params : {}
    if (projectId !== undefined && projectId !== null && projectId !== '') {
      dispatch({ type: 'project/CLEAR_OLD_PROJECT' })
    }
  }

  setUserShowModal = val => this.setState({ userShowModal: val, passData: '' })

  render() {
    const tableColumns = [
      {
        title: () => <FormattedMessage id="project.roles.roleName" />,
        dataIndex: 'roleName',
        key: 'name',
        render: name => {
          let element
          switch (name) {
            case 'SYSTEM_ADMIN':
              element = <FormattedMessage id="project.roles.admin" />
              break
            case 'PROJECT_CREATOR':
              element = <FormattedMessage id="project.roles.creator" />
              break
            case 'GUEST':
              element = <FormattedMessage id="project.roles.guest" />
              break
            case 'ORDINARY':
              element = <FormattedMessage id="project.roles.ordinary" />
              break
            default:
              element = name
              break
          }
          return element
        },
      },
      {
        title: () => <FormattedMessage id="project.roles.roleRule" />,
        dataIndex: 'rolesRule',
        key: 'rolesRule',
      },
    ]
    const { filtered, passData, userShowModal, projectCreator } = this.state
    const {
      user: { ID: id },
      project: { authRole },
    } = this.props
    console.log(filtered, 'FILTERED')
    return (
      <div className="row">
        <Helmet title="Roles" />
        <div className="col-md-6">
          <div style={{ minHeight: '650px', maxHeight: '650px' }} className="card">
            <Button
              style={{ margin: '20px 20px 0 20px' }}
              onClick={() => this.setUserShowModal(!userShowModal)}
            >
              <FormattedMessage id="project.roles.addNew" />
            </Button>
            <div className="card-body">
              <Table
                className="utils__scrollTable"
                scroll={{ x: '100%' }}
                onRowClick={data => this.setState({ passData: data, userShowModal: true })}
                columns={tableColumns}
                dataSource={filtered || []}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div style={{ minHeight: '650px', maxHeight: '650px' }} className="card">
            <div className="card-body">
              {userShowModal ? (
                <ConfigRolesModal
                  projectCreator={projectCreator}
                  setUserShowModal={this.setUserShowModal}
                  passData={passData}
                  roles={() => role(id, authRole)}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Roles
