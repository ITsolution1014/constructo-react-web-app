import React, { Component } from 'react'
import { Button, Input, Spin } from 'antd'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import './dashboard.scss'

@connect(({ project, user, settings }) => ({ project, user, settings }))
class Dashboard extends Component {
  state = {
    name: '',
    street: '',
    city: '',
  }

  componentDidMount = async () => {
    const {
      dispatch,
      project: { userProjects },
      user: { projectId },
    } = this.props
    const userProjectId = userProjects && userProjects.projectId
    if (!userProjectId && projectId) dispatch({ type: 'project/GET_USER_PROJECT' })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  editProject = projectId => {
    const { history } = this.props
    if (projectId !== undefined && projectId !== null) {
      history.push(`/construction/${projectId}`)
    }
  }

  render() {
    const { name, city, street } = this.state

    const {
      project,
      settings: { isLightTheme },
    } = this.props
    const { userProjects, loading } = project && project
    const { name: Name, city: City, street: Street, projectId } = userProjects || {}

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className={isLightTheme ? 'card' : 'card-dark'}>
            <div className="card-body">
              <h2 className="heading-dark">
                <FormattedMessage id="dashboard.Home" />
              </h2>
              <div className="current">
                <div className="currentPage">
                  <h2 className="heading-dark">
                    <FormattedMessage id="dashboard.PagInfo" />
                  </h2>
                </div>
                <div className="input-form">
                  {loading ? (
                    <Spin />
                  ) : (
                    <Input
                      className="form-items"
                      value={name.length ? name : Name}
                      name="name"
                      placeholder="Name"
                      onChange={this.onChange}
                    />
                  )}
                  {loading ? (
                    <Spin />
                  ) : (
                    <Input
                      className="form-items"
                      value={street.length ? street : Street}
                      name="street"
                      placeholder="Street"
                      onChange={this.onChange}
                    />
                  )}
                  {loading ? (
                    <Spin />
                  ) : (
                    <Input
                      className="form-items"
                      value={city.length ? city : City}
                      name="city"
                      placeholder="City"
                      onChange={this.onChange}
                    />
                  )}
                  <Button onClick={() => this.editProject(projectId)} className="form-btn">
                    <FormattedMessage id="dashboard.detail" />
                  </Button>
                </div>
              </div>
              <div className="btns">
                <Button onClick={() => console.log('clicked Dairy')}>
                  <FormattedMessage id="dashboard.diary" />
                </Button>
                <Button onClick={() => console.log('clicked Files')}>
                  <FormattedMessage id="dashboard.files" />
                </Button>
                <Button onClick={() => console.log('clicked Settings')}>
                  <FormattedMessage id="dashboard.setting" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard
