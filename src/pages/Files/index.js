import React from 'react'
import { Table, Button, Form, Tooltip } from 'antd'
import { Image } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import CircularJSON from 'circular-json'
import { FormattedMessage } from 'react-intl'
import WithModal from '../../components/HOC/WithModal'
import FilesUploader from '../../components/FilesComponent/FilesUploader'
import { getLocation, getTime, customNotification } from '../../components/helpers'
import fileSvg from '../../assets/images/file.svg'
import folderSvg from '../../assets/images/folder.svg'

@connect(({ user, project, files, menu }) => ({ user, project, files, menu }))
export default class Files extends React.Component {
  state = { showModal: false, folderName: '', dummyData: [], fileModal: false }

  componentDidMount() {
    const {
      dispatch,
      match,
      user: { projectID: projectId },
    } = this.props

    if (!match.params.folderId && projectId)
      dispatch({ type: 'files/GET_FOLDERS', payload: { projectId } })

    const backData = CircularJSON.parse(localStorage.getItem('back'))
    if (match.url !== '/files' && !backData)
      dispatch({ type: 'files/GET_FOLDER', payload: { Id: match.url } })
    if (match.url === '/files') {
      localStorage.removeItem('list')
      localStorage.removeItem('back')
    }
  }

  componentWillReceiveProps = prevProps => {
    const { files } = this.props
    const { folders, updated, uploaded } = files || {}
    if (folders !== prevProps.files.folders) {
      const data = prevProps.files.folders.map(item => {
        return { ...item, key: Math.floor(Math.random() * 100000) }
      })
      this.setState({ dummyData: data, folderName: '', showModal: false })
    }
    if (updated !== prevProps.files.updated)
      this.setState({ folderData: '', showModal: false, folderName: '' })
    if (uploaded !== prevProps.files.uploaded) this.setState({ fileModal: false })
  }

  componentWillUnmount() {
    localStorage.removeItem('list')
    localStorage.removeItem('back')
  }

  rowClickHandler = row => {
    const { dummyData } = this.state
    const { history, dispatch, match } = this.props
    const { url } = match || {}
    const name = dummyData.filter(item => row.ref === item.ref)
    const back = CircularJSON.parse(localStorage.getItem('back'))
    const backname =
      back && back[0] && back[0].data && back[0].data.filter(item => row.ref === item.ref)
    const { folderId5 } = match && match.params

    if (row.isFolder && !folderId5) {
      const localArray = CircularJSON.parse(localStorage.getItem('list'))
        ? [...CircularJSON.parse(localStorage.getItem('list'))]
        : []
      const folderName = name && name[0] && name[0].name && name[0].name
      const folderName1 = backname && backname[0] && backname[0].name && backname[0].name
      localArray.push({
        pathname: `${url}/${row.id || row.ref}`,
        name: folderName || folderName1,
        data: dummyData || (backname && backname[0] && backname[0].data),
      })
      localStorage.setItem('list', CircularJSON.stringify(localArray))
      dispatch({ type: 'files/GET_FOLDER', payload: { Id: `${url}/${row.id}` } })
      history.push({ pathname: `${url}/${row.id || row.ref}` })
      localStorage.removeItem('back')
    }
  }

  setFileModal = () => {
    const { fileModal } = this.state
    this.setState({ fileModal: !fileModal })
  }

  createFolderHandler = async () => {
    const { folderName } = this.state
    const {
      match,
      files: { folders },
      dispatch,
      project: { userProjects },
    } = this.props
    const { folderId5 } = (match && match.params) || {}

    let ref = ''
    if (!match.params.folderId) ref = '/files'
    else ref = match.url
    if (folderId5 === undefined) {
      const currentId = match.url.split('/').pop()
      const { location } = (await getLocation('', dispatch, () => {})) || {}
      if (folderName && userProjects && location) {
        const backData = CircularJSON.parse(localStorage.getItem('back'))
        const backFolders = backData && backData[0] && backData[0].data
        dispatch({
          type: 'files/CREATE_FOLDER',
          payload: {
            userProjects,
            folderName,
            location,
            currentId,
            ref,
            folder: true,
            folders: backFolders || folders,
          },
        })
      }
    }
  }

  onChangeUploadFile = async files => {
    const {
      match,
      files: { folders },
      dispatch,
      project: { userProjects },
    } = this.props
    const currentId = match.url.split('/').pop()
    let ref = ''
    if (!match.params.folderId) ref = '/files'
    else ref = match.url

    const { location } = (await getLocation('', dispatch, () => {})) || {}
    if (location && files.length > 0 && userProjects) {
      const backData = CircularJSON.parse(localStorage.getItem('back'))
      const backFolders = backData && backData[0] && backData[0].data

      dispatch({
        type: 'files/UPLOAD_FILES',
        payload: {
          userProjects,
          location,
          currentId,
          ref,
          folders: backFolders || folders,
          files,
        },
      })
    }
  }

  updateFolderName = () => {
    const {
      match: { url },
      dispatch,
      project: { userProjects },
      files: { folders },
    } = this.props
    const { folderData, folderName } = this.state
    if (folders && folderData)
      dispatch({
        type: 'files/UPDATE_FOLDER_NAME',
        payload: { folders, folderData, url, folderName, userProjects },
      })
  }

  deleteFiles = file => {
    const {
      dispatch,
      project: { userProjects },
      match: { url },
      files: { folders },
    } = this.props
    dispatch({ type: 'files/DELETE_FILE', payload: { file, url, folders, userProjects } })
  }

  role = () => {
    const {
      user: { ID: id },
      project: { authRole },
    } = this.props
    const uid = id || ''
    const rolesArray = authRole || []
    let data = ''
    rolesArray.forEach(rolesId => {
      if (rolesId && rolesId.users && rolesId.users.includes(uid)) {
        console.log()
        data = { filesRule: rolesId.filesRule, deletedRule: rolesId.filesDeleteRule }
      }
    })
    return data
  }

  render() {
    const {
      match,
      files: { loading, uploading },
    } = this.props
    const { folderId5 } = match && match.params
    const { showModal, folderName, dummyData, folderData, fileModal } = this.state
    const localData = CircularJSON.parse(localStorage.getItem('back')) || []
    const daynamic = localData && localData[0] && localData[0].data
    const local = (daynamic && daynamic) || (dummyData && dummyData)

    const filesData = local && local.filter(ele => ele.isFolder === false)
    const foldersData = local && local.filter(ele => ele.isFolder === true)

    const updatedData = foldersData && filesData ? [...foldersData, ...filesData] : []

    const tableColumns = [
      {
        title: '',
        dataIndex: 'name',
        key: 'name',
        render: (text, data) => (
          <Image
            onClick={
              this.role().filesRule === 'WRITE' || this.role().filesRule === 'READ'
                ? () => this.rowClickHandler(data)
                : () =>
                    customNotification(
                      'warn',
                      'Access Denied',
                      'You Dont Have Access To Perform This Operation',
                    )
            }
            style={{ width: 40, height: 40, cursor: 'pointer' }}
            src={data.isFolder ? folderSvg : fileSvg}
            alt="Icons"
          />
        ),
      },
      {
        title: () => <FormattedMessage id="projectList.name" />,
        dataIndex: 'name',
        key: 'folder',
        render: text => (
          <p>
            {text.length > 20 ? (
              <Tooltip title={text}>{text.slice(0, 20)} ...</Tooltip>
            ) : (
              text || 'folderName'
            )}
          </p>
        ),
      },

      {
        title: '',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: createdAt => <p>{getTime(createdAt.seconds)}</p>,
      },
      {
        title: '',
        dataIndex: 'delete',
        key: 'delete',
        render: (text, data) => (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {data.isFolder ? (
              <Button
                style={{ marginRight: 10 }}
                disabled={this.role().filesRule !== 'WRITE'}
                onClick={() =>
                  this.setState({ showModal: true, folderData: data, folderName: data.name })
                }
              >
                <FormattedMessage id="files&foolders.rename" />
              </Button>
            ) : null}

            {!data.isFolder && data.storageUrl ? (
              <Button
                style={{ marginLeft: 10 }}
                onClick={() => window.open(data.storageUrl, 'self')}
              >
                <FormattedMessage id="recordList.download" />
              </Button>
            ) : null}

            {data.isFolder ? (
              <Button
                onClick={
                  this.role().filesRule === 'WRITE' || this.role().filesRule === 'READ'
                    ? () => this.rowClickHandler(data)
                    : () =>
                        customNotification(
                          'warn',
                          'Access Denied',
                          'You Dont Have Access To Perform This Operation',
                        )
                }
              >
                <FormattedMessage id="files&foolders.open" />
              </Button>
            ) : null}

            <Button
              style={{ marginLeft: 10 }}
              type="danger"
              disabled={!this.role().deletedRule}
              loading={loading}
              onClick={() => this.deleteFiles(data)}
            >
              <FormattedMessage id="project.setting.delete" />
            </Button>
          </div>
        ),
      },
    ]

    return (
      <div className="row">
        <Helmet title="Files" />
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  disabled={
                    this.role().filesRule !== 'WRITE' ||
                    (filesData && filesData.length > 69) ||
                    uploading
                  }
                  className="mb-2 mr-2"
                  onClick={this.setFileModal}
                >
                  <FormattedMessage id="files&foolders.add" />
                </Button>

                <Button
                  disabled={this.role().filesRule !== 'WRITE' || folderId5 !== undefined}
                  onClick={() => this.setState({ showModal: !showModal })}
                  className="mb-2 mr-2"
                >
                  <FormattedMessage id="files&foolders.addFolder" />
                </Button>
              </div>

              <Table
                className="utils__scrollTable file-list-table"
                scroll={{ x: '100%' }}
                columns={tableColumns}
                dataSource={updatedData || []}
                pagination={{ pageSize: 10 }}
                size="middle"
                rowKey="key"
              />
            </div>
            <FilesUploader
              filesUpload={this.onChangeUploadFile}
              fileModal={fileModal}
              setFileModal={this.setFileModal}
              uploading={uploading}
            />
            <WithModal
              showModal={showModal}
              hideModal={() => this.setState({ showModal: false, folderName: '', folderData: '' })}
              deleteModal
            >
              <Form.Item label={<FormattedMessage id="files&foolders.fname" />}>
                <input
                  style={{
                    width: '100%',
                    border: '1px solid lightgrey',
                    borderRadius: '10px',
                    padding: '0 10px',
                  }}
                  type="text"
                  value={folderName}
                  name="name"
                  onChange={e => this.setState({ folderName: e.target.value })}
                />
              </Form.Item>
              <Button
                loading={loading}
                onClick={!folderData ? this.createFolderHandler : this.updateFolderName}
                type="primary"
                className="mr-2"
              >
                <FormattedMessage id="files&foolders.confirm" />
              </Button>
              <Button
                onClick={() => this.setState({ showModal: false, folderName: '', folderData: '' })}
              >
                <FormattedMessage id="project.management.modal.configRoles.modalbtnClose" />
              </Button>
            </WithModal>
          </div>
        </div>
      </div>
    )
  }
}
