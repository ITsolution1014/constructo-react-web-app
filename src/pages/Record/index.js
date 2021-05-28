import React, { Component } from 'react'
import { Form, Button, Spin, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Spinner from 'react-spinkit'
import Content from './Content'
import icon from '../../assets/images/mid-mid-sun.png'
import Rightbar from './RightBar'
import Verification from '../../components/RecordComponents/Verification'
import { handleTimeStamp, getLocation, DownloadPdf } from '../../components/helpers'
import './record.scss'

@Form.create()
@connect(({ user, record, project, settings }) => ({ user, record, project, settings }))
export default class index extends Component {
  state = { inPos: '', location: '', projectId: '', modal: false, projectCreator: false }

  componentDidMount = async () => {
    const {
      dispatch,
      record: { location },
      match: { params },
    } = this.props
    const position = await getLocation('edit', dispatch, this.setLocation)
    this.setState({ location: position.location })

    const { projectId } = params || {}
    this.setState({ projectId })
    dispatch({
      type: 'records/GET_BY_ID',
      payload: { recordId: projectId, location: position || location },
    })
  }

  // componentDidUpdate(nextProps) {
  //   const {
  //     record: { created, sign, download, recordDetails, recoverd ,isSent},
  //     history,
  //   } = this.props
  //   const { signedUrl } = recordDetails || {}
  //   if (
  //     nextProps.record.created !== created ||
  //     nextProps.record.sign !== sign ||
  //     nextProps.record.recoverd !== recoverd
  //   )
  //     history.push('/recordslist')

  //   if (nextProps.record.download !== download && signedUrl !== null) window.open(signedUrl, '_self')
  //     if (nextProps.record.isSent !== isSent) this.setState({ modal: true })
  // }

  componentWillReceiveProps(nextProps) {
    const {
      record: { created, sign, download, recordDetails, recoverd, isSent },
      history,
    } = this.props
    const { signedUrl } = recordDetails || {}
    if (
      nextProps.record.created !== created ||
      nextProps.record.sign !== sign ||
      nextProps.record.recoverd !== recoverd
    )
      history.push('/recordslist')

    if (nextProps.record.download !== download && signedUrl !== null)
      window.open(signedUrl, '_self')

    if (nextProps.record.isSent !== isSent) this.setState({ modal: true })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch({ type: 'records/WEATHER' })
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
        data = rolesId.diaryRule
      }
    })
    return data
  }

  componentWillReceiveProps = async prevProps => {
    const { user, project } = this.props
    const { userProjects } = project || {}
    if (prevProps.project.userProjects !== userProjects) {
      const { userID } = userProjects || {}
      if (userID) {
        const { ID } = user || {}
        const flag = userID === ID || this.role() === 'WRITE'
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

  setLocation = location => this.setState(location)

  handelSubmit = () => {
    const {
      form,
      dispatch,
      record: { recordId, records, location, weathers, recordDetails },
      user: { name, ID, surname },
    } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        if (recordDetails !== undefined) {
          const { category, content } = values
          dispatch({
            type: 'records/UPDATE',
            payload: { category, content, recordDetails, records },
          })
        } else {
          const { projectId } = this.state
          const { category, content } = values
          dispatch({
            type: 'record/CREATE',
            payload: {
              category,
              content,
              userName: `${name} ${surname}`,
              ID,
              location,
              files: '',
              projectID: projectId,
              recordId,
              weathers,
              records,
            },
          })
        }
      }
    })
  }

  uploadFiles = filesData => {
    const {
      dispatch,
      project: { userProjects },
      record: { records, location, weathers, recordDetails, files, recordID },
      user: { ID, name, surname },
    } = this.props
    if (filesData.length > 0) {
      if (recordDetails !== undefined) {
        dispatch({
          type: 'records/UPDATE',
          payload: { filesData, recordDetails, userProjects, records, filesRecord: files },
        })
      } else {
        const { projectId } = this.state
        dispatch({
          type: 'record/CREATE',
          payload: {
            category: '',
            content: '',
            userName: `${name} ${surname}`,
            ID,
            location,
            files: filesData,
            projectID: projectId,
            deleted: true,
            weathers,
            userProjects,
            recordFiles: files,
            recordId: recordID,
          },
        })
      }
    }
  }

  signRecord = () => {
    const {
      dispatch,
      record: { records, location, files, weathers, recordDetails, verificationCode },
      user,
      project: { userProjects },
    } = this.props
    if (recordDetails) {
      dispatch({
        type: 'records/Signed',
        payload: {
          recordDetails,
          location,
          user,
          userProjects,
          files,
          weathers,
          records,
          verificationCode,
        },
      })
    }
  }

  getLatitude = values => {
    const { lat, lng } = values
    if (values) this.setState({ inPos: { _lat: lat, _long: lng } })
  }

  deleteFile = fileData => {
    const {
      dispatch,
      record: { files },
    } = this.props
    dispatch({ type: 'records/FILEDELETE', fileData, files })
  }

  recoverRecord = () => {
    const {
      record: { recordDetails, records },
      dispatch,
    } = this.props
    if (recordDetails && records)
      dispatch({ type: 'records/RECOVER', payload: { records, recordDetails } })
  }

  MessageHandler = () => {
    const {
      dispatch,
      user,
      history,
      settings: { locale },
    } = this.props

    if (user?.phone) {
      dispatch({ type: 'records/SENT_MESSAGE', payload: { phoneNumber: user?.phone, locale } })
    } else {
      notification.warn({ message: 'Please Add Phone Number Before Sign Record' })
      history.push('/profile')
    }
  }

  render() {
    const { projectCreator } = this.state
    console.log(projectCreator)
    const { inPos, location, modal } = this.state
    const {
      form,
      dispatch,
      user,
      record: { create, recordDetails, loading, weathers, signing, files, downloading },
    } = this.props
    const { signed, category, deleted, createdAt, content, positionIn, signedUrl } =
      recordDetails || {}
    const date = new Date()
    const recordUserId = recordDetails && recordDetails.userID
    const WriteAccess = this.role() !== 'WRITE'
    const access =
      user.ID !== recordUserId && recordUserId !== undefined ? !WriteAccess : WriteAccess

    const finalWrite = signed || deleted ? true : access

    return (
      <React.Fragment>
        <Helmet title="Record Detail" />
        <Spin
          spinning={weathers === undefined || weathers === ''}
          indicator={<Spinner name="ball-spin-fade-loader" />}
        >
          <React.Fragment>
            <div
              className="mb-3"
              style={{ display: 'flex', justifyContent: 'flex-end', alignContent: 'center' }}
            >
              {signedUrl || (signed && this.role() !== 'DISABLE') ? (
                <Button
                  loading={downloading}
                  className="mr-2"
                  disabled={!signed}
                  onClick={() =>
                    signedUrl
                      ? window.open(signedUrl, '_blank')
                      : DownloadPdf(dispatch, recordDetails)
                  }
                >
                  <FormattedMessage id="recordList.download" />
                </Button>
              ) : null}
              {deleted ? (
                <Button
                  loading={loading}
                  disabled={this.role() === 'DISABLE'}
                  className="mr-2"
                  onClick={this.recoverRecord}
                >
                  <FormattedMessage id="project.setting.recover" />
                </Button>
              ) : null}

              <Button
                className="mr-2"
                disabled={finalWrite}
                onClick={
                  recordDetails?.createdAt
                    ? this.MessageHandler
                    : () => notification.warn({ message: 'Save the Record before sign' })
                }
                loading={signing}
              >
                <FormattedMessage id="recordDetails.sign" />
              </Button>
              <Button disabled={finalWrite} loading={create} onClick={this.handelSubmit}>
                <FormattedMessage id="project.save" />
              </Button>
            </div>

            {modal ? (
              <Verification
                verify={this.signRecord}
                modal={modal}
                sendMessage={this.MessageHandler}
                setModal={() => this.setState({ modal: !modal })}
              />
            ) : null}

            <div className="px-4 py-2 card" style={{ height: '100px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <h3>
                    <FormattedMessage id="recordDetails.pageName" />
                  </h3>
                  <p>{createdAt ? handleTimeStamp(createdAt.seconds) : date.toString()}</p>
                </div>
                <div>
                  <img alt="icon" style={{ width: '60px' }} src={icon} />
                  <p style={{ textAlign: 'center' }}>
                    <strong>
                      {`${
                        weathers && weathers.mainTemperature && weathers.mainTemperature.day
                          ? weathers.mainTemperature.day
                          : 'Temperature'
                      } c`}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Main Content */}

              <div className="col-lg-8">
                <Content
                  content={content || ''}
                  deleted={deleted}
                  signed={signed}
                  category={category}
                  loading={loading}
                  getFile={this.uploadFiles}
                  formHandel={form}
                  files={files}
                  deleteFile={this.deleteFile}
                  write={finalWrite}
                  role={this.role}
                />
              </div>

              {/* RightBarContent */}

              <div className="col-lg-4">
                <Rightbar
                  inPos={inPos}
                  location={positionIn || location}
                  latitudeHandler={this.getLatitude}
                  formHandel={form}
                />
              </div>
            </div>
          </React.Fragment>
        </Spin>
      </React.Fragment>
    )
  }
}
