import React from 'react'
import { Form, Row, Col, Button } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import General from '../../../components/projectComponents/General'
import Management from '../../../components/projectComponents/Management'
import Settings from '../../../components/projectComponents/Settings'
import { ProjectModel } from '../../../Models'

@Form.create()
@connect(({ user, project, settings }) => ({ user, project, settings }))
export default class Construction extends React.Component {
  state = { projectID: '', street: '', state: '', zip: '', city: '', location: '' }

  componentDidMount() {
    const { match, dispatch } = this.props
    const { projectId } = match && match.params ? match.params : {}
    if (projectId) {
      this.setState({ projectID: projectId })
      dispatch({ type: 'project/GET_PROJECT_BY_ID', payload: projectId })
    } else dispatch({ type: 'project/CLEAR_OLD_PROJECT' })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    const { projectID } = this.state
    if (projectID !== '') {
      dispatch({ type: 'project/CLEAR_OLD_PROJECT' })
    }
  }

  componentWillReceiveProps = prevProps => {
    const { history, project } = this.props

    if (prevProps.project.currentProject !== project.currentProject) {
      const { location } = project && project.currentProject ? project.currentProject : {}
      this.setState({ location })
    }
    if (
      prevProps.project.delete !== project.delete ||
      prevProps.project.recoverd !== project.recoverd ||
      prevProps.project.create !== project.create
    )
      history.push('/projects')
  }

  handelSubmit = () => {
    const { form, dispatch } = this.props
    const { projectID, location } = this.state

    form.validateFields((err, values) => {
      if (!err) {
        const updateValues = { ...values }
        updateValues.estimatedStart = new Date(values.estimatedStart)
        updateValues.estimatedFinish = new Date(values.estimatedFinish)
        updateValues.active = values.active === 'Active'
        updateValues.location = location
        if (!projectID) {
          const projectData = { ...ProjectModel, ...updateValues }

          dispatch({ type: 'project/CREATE', payload: projectData })
        } else {
          const {
            project: { currentProject, Users, pendingRegistrations },
          } = this.props
          if (currentProject.deletedAt !== undefined) {
            const updatedProject = { ...currentProject, ...updateValues }
            updatedProject.createdAt = currentProject.createdAt
            updatedProject.deletedAt = currentProject.deletedAt
            updatedProject.updatedAt = currentProject.updatedAt
            updatedProject.timestamp = currentProject.timestamp
            updatedProject.users = Users
            updatedProject.pendingRegistrations = pendingRegistrations
            dispatch({ type: 'project/CREATE', payload: updatedProject })
          } else {
            const updatedProject = { ...currentProject, ...updateValues }
            updatedProject.createdAt = currentProject.createdAt
            updatedProject.updatedAt = currentProject.updatedAt
            updatedProject.timestamp = currentProject.timestamp
            updatedProject.users = Users
            updatedProject.pendingRegistrations = pendingRegistrations
            dispatch({ type: 'project/CREATE', payload: updatedProject })
          }
        }
      }
    })
  }

  searchMap = () => {
    const { form } = this.props
    this.setState({
      street: form.getFieldValue('street'),
      state: form.getFieldValue('state'),
      city: form.getFieldValue('city'),
      zip: form.getFieldValue('zip'),
    })
  }

  getLatitude = values => {
    const { lat, lng } = values
    if (values) this.setState({ location: { _lat: lat, _long: lng } })
  }

  role = () => {
    const {
      user: { ID },
      project: { authRole },
    } = this.props
    const uid = ID || ''
    const rolesArray = authRole || []
    let data = ''

    rolesArray.forEach(rolesId => {
      if (rolesId && rolesId.users && rolesId.users.includes(uid)) {
        data = rolesId.projectRule
      }
    })
    return data
  }

  render() {
    const {
      form,
      settings: { isLightTheme },
      project: { loading, currentProject },
    } = this.props
    const { deleted } = currentProject || {}
    const { city, state, zip, street, projectID } = this.state
    return (
      <React.Fragment>
        <Helmet title="Project Detail" />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '16px 16px',
          }}
        >
          <div>
            <h3 style={{ color: isLightTheme ? 'black' : 'white' }}>
              <FormattedMessage id="projectList.create" />
            </h3>
          </div>

          <div>
            <Link to="/projects">
              <Button style={{ marginLeft: '5px' }}>
                {(this.role() === 'WRITE' && projectID) ||
                projectID === '' ||
                projectID === undefined ||
                projectID === null ? (
                  <FormattedMessage id="project.discard" />
                ) : (
                  <FormattedMessage id="project.back" />
                )}
              </Button>
            </Link>

            {(this.role() === 'WRITE' && projectID) ||
            projectID === '' ||
            projectID === undefined ||
            projectID === null ? (
              <Button
                disabled={deleted || false}
                loading={loading}
                onClick={this.handelSubmit}
                style={{ marginLeft: '5px' }}
              >
                <FormattedMessage id="project.save" />
              </Button>
            ) : null}
          </div>
        </div>

        <Row justify="space-between">
          <Col style={{ padding: '0 15px' }} md={8} span={24}>
            <General
              mapSearch={this.searchMap}
              city1={city}
              street1={street}
              zip1={zip}
              state1={state}
              latitudeHandler={this.getLatitude}
              formHandel={form}
              projectId={projectID}
              roles={this.role}
            />
          </Col>
          <Col style={{ padding: '0 15px' }} md={8} span={24}>
            <Management roles={this.role} projectId={projectID} formHandel={form} />
          </Col>
          <Col style={{ padding: '0 15px' }} md={8} span={24}>
            <Settings roles={this.role} projectId={projectID} formHandel={form} />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
