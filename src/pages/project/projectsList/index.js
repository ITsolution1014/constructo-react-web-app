import React, { Component } from 'react'
import { Table, Button, notification, Select } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import CircularJSON from 'circular-json'
import './projects.module.scss'

@connect(({ project, user }) => ({ project, user }))
class UserProjects extends Component {
  state = {
    filteredData: '',
  }

  componentDidMount = async () => {
    const { dispatch } = this.props
    await dispatch({ type: 'projects/GET' })
    this.handleChange('all')
  }

  handleChange = value => {
    const { project } = this.props
    let data = project.allProjects
    data =
      project &&
      project.allProjects &&
      data.map(item => {
        return { ...item, key: Math.floor(Math.random() * 100000) }
      })

    switch (value) {
      case 'inactive':
        data =
          data &&
          data.filter(item => {
            return item.active ? item.active === false : ''
          })
        this.setState({ filteredData: data })
        break

      case 'active':
        data =
          data &&
          data.filter(item => {
            return item.active ? item.active === true : ''
          })
        this.setState({ filteredData: data })
        break

      case 'deleted':
        data = data && data.filter(item => (item.deleted ? item.deleted === true : ''))
        // this.setState({ filtered: true, filteredData: data })
        this.setState({ filteredData: data })
        break

      default:
        // this.setState({ filtered: true, filteredData: data })
        this.setState({ filteredData: data })
        break
    }
  }

  setProjectId = async (userID, projectId) => {
    const {
      dispatch,
      project: { userProjects },
    } = this.props

    await dispatch({ type: 'project/SET_PROJECT_ID', payload: { userID, projectId, userProjects } })
    await dispatch({ type: 'projects/GET' })
    await dispatch({ type: 'project/GET_USER_PROJECT' })

    notification.success({
      message: 'Project Selected',
      description: 'Project Selected Successfully',
    })
  }

  componentWillReceiveProps = async prevProps => {
    const { project } = this.props
    if (
      CircularJSON.stringify(project.allProjects) !==
      CircularJSON.stringify(prevProps.project.allProjects)
    ) {
      let data = prevProps.project.allProjects
      data =
        data &&
        data.map(item => {
          return { ...item, key: Math.floor(Math.random() * 100000) }
        })
      // this.setState({ filtered: true, filteredData: data })
      this.setState({ filteredData: data })
    }
  }

  editProject = projectId => {
    const { history } = this.props
    if (projectId !== undefined && projectId !== null) {
      history.push(`/construction/${projectId}`)
    }
  }

  render() {
    const { filteredData } = this.state
    const { Option } = Select
    const {
      // loading,
      user: { id },
    } = this.props
    const tableColumns = [
      {
        title: () => <FormattedMessage id="projectList.name" />,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: () => <FormattedMessage id="projectList.street" />,
        dataIndex: 'street',
        key: 'street',
      },
      {
        title: () => <FormattedMessage id="projectList.state" />,
        dataIndex: 'state',
        key: 'state',
      },
      {
        title: () => <FormattedMessage id="projectList.status" />,
        dataIndex: 'active',
        key: 'active',
        render: (text, record) =>
          record.deleted ? (
            <p className="status deleted">
              <FormattedMessage id="dashboard.deleted" />
            </p>
          ) : (
            <p className={record.active ? 'status active' : 'status inactive'}>
              {record.active ? (
                <FormattedMessage id="dashboard.active" />
              ) : (
                <FormattedMessage id="dashboard.inactive" />
              )}
            </p>
          ),
      },

      {
        title: () => <FormattedMessage id="dashboard.detail" />,
        dataIndex: 'details',
        render: (text, record) => (
          <div className="d-flex">
            <div className="mr-2">
              <Button
                disabled={record.selected || record.deleted}
                onClick={() => this.setProjectId(record.docId, record.projectID)}
              >
                <FormattedMessage id="projectList.set" />
              </Button>
            </div>
            <Button type="primary" onClick={() => this.editProject(record.projectID)}>
              {record.userID === id ? (
                <FormattedMessage id="projectList.edit" />
              ) : (
                <FormattedMessage id="dashboard.detail" />
              )}
            </Button>
          </div>
        ),
      },
    ]

    return (
      <div className="row">
        <Helmet title="Projects" />
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                
              </div> */}
              <div
                className="select-box mb-2"
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <div className="mr-2">
                  <Link to="/construction">
                    <Button>
                      <FormattedMessage id="projectList.create" />
                    </Button>
                  </Link>
                </div>
                <Select defaultValue="All" className="select" onChange={this.handleChange}>
                  <Option value="all">
                    <FormattedMessage id="projectList.all" />
                  </Option>
                  <Option value="inactive">
                    <FormattedMessage id="dashboard.inactive" />
                  </Option>
                  <Option value="active">
                    <FormattedMessage id="dashboard.active" />
                  </Option>
                  <Option value="deleted">
                    <FormattedMessage id="dashboard.deleted" />
                  </Option>
                </Select>
              </div>
              <Table
                className="utils__scrollTable"
                scroll={{ x: '100%' }}
                columns={tableColumns}
                dataSource={filteredData || []}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserProjects
