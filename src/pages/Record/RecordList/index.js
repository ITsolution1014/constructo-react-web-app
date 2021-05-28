import React from 'react'
import { connect } from 'react-redux'
import { Table, Button, notification, Select } from 'antd'
import { FormattedMessage } from 'react-intl'
import { Helmet } from 'react-helmet'
import { Badge } from 'react-bootstrap'
import { getLocation, DownloadPdf } from '../../../components/helpers'
import WithModal from '../../../components/HOC/WithModal/index'
import './recordList.scss'

@connect(({ user, project, record }) => ({ user, project, record }))
export default class RecordList extends React.Component {
  state = {
    filteredData: '',
    location: '',
    showModal: false,
    recordId: '',
    showHardModal: false,
    fileId: '',
  }

  componentDidMount() {
    const {
      dispatch,
      record: { records },
      user,
    } = this.props
    // this.handleChange();
    const singlRecId =
      records && records[0] && records[0] && records[0].projectID && records[0].projectID
    if (user.projectID !== singlRecId) this.onPageChange(1)

    getLocation('componentDidMount', dispatch, this.setLocation)
  }

  setLocation = location => this.setState(location)

  componentDidUpdate = async prevProps => {
    const { filteredData } = this.state
    if (prevProps.record.records?.length > filteredData?.length) this.handleChange()
  }

  componentWillReceiveProps = async prevProps => {
    const { record } = this.props
    const { records } = record || {}
    let data
    if (prevProps.record.records !== records) {
      data = prevProps.record.records?.map(item => {
        return { ...item, key: Math.floor(Math.random() * 100000) }
      })
      this.setState({ filteredData: data })
      // this.handleChange('all')
    }

    if (prevProps.record.download !== record.download) {
      const { fileId } = this.state
      records.forEach(ele => {
        if (ele.ID === fileId) {
          window.open(ele.signedUrl, '_self')
        }
      })
    }
    // this.handleChange('all')
  }

  editProject = async recordId => {
    const {
      project: {
        userProjects: { projectID },
      },
      history,
      dispatch,
    } = this.props

    const { location } = this.state
    const getLocationResponse = await getLocation('edit', dispatch, this.setLocation)
    const response = location || getLocationResponse

    if (response) {
      const Id = recordId || projectID
      dispatch({ type: 'records/WEATHER' })
      if (projectID !== undefined && projectID !== null) history.push(`/records/${Id}`)
    }
  }

  onPageChange = () => {
    const { user, dispatch } = this.props
    const Id = user && user.projectID
    if (Id) dispatch({ type: 'records/GET', payload: { projects: Id } })
  }

  onSoftDeleteRecord = recordId => {
    const {
      dispatch,
      record: { records },
    } = this.props
    const res = dispatch({ type: 'records/SOFTDELETERECORD', payload: { recordId, records } })
    if (res && res.payload && Object.values(res.payload).length) {
      notification.success({
        message: 'Record Deleted',
        description: 'Successfully deleted the Record',
      })
      this.setState({ showModal: false })
    }
  }

  onHardDeleteRecord = recordId => {
    const {
      dispatch,
      record: { records },
    } = this.props

    const res = dispatch({ type: 'records/HARDDELETERECORD', payload: { recordId, records } })
    if (res && res.payload && Object.values(res.payload).length) {
      notification.success({
        message: 'Record Deleted from Database',
        description: 'Successfully deleted the Record form Database',
      })
      this.setState({ showHardModal: false })
    }
  }

  handleChange = value => {
    const { record } = this.props
    let data = record && record?.records ? record?.records : []
    data =
      data &&
      data.map(item => {
        return { ...item, key: Math.floor(Math.random() * 100000) }
      })
    switch (value) {
      case '#ORDINARY':
        data = data && data.filter(item => item.category === '#ORDINARY')
        this.setState({ filteredData: data })
        break

      case '#ACCIDENT':
        data = data && data.filter(item => item.category === '#ACCIDENT')
        this.setState({ filteredData: data })
        break

      case '#REVIEW':
        data = data && data.filter(item => item.category === '#REVIEW')
        this.setState({ filteredData: data })
        break
      case '#BUREAU':
        data = data && data.filter(item => item.category === '#BUREAU')
        this.setState({ filteredData: data })
        break
      case '#MATERIAL':
        data = data && data.filter(item => item.category === '#MATERIAL')
        this.setState({ filteredData: data })
        break
      case '#NONE':
        data = data && data.filter(item => item.category === '#NONE')
        this.setState({ filteredData: data })
        break
      default:
        this.setState({ filteredData: data })
        break
    }
  }

  downloadHandel = (url, record) => {
    const {
      dispatch,
      record: { records },
    } = this.props
    if (url) window.open(url, '_blank')
    else {
      this.setState({ fileId: record.ID })
      DownloadPdf(dispatch, record, 'recordList', records)
    }
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
        data = rolesId.diaryRule
      }
    })
    return data
  }

  render() {
    const { filteredData, showModal, showHardModal, recordId } = this.state
    console.log(filteredData, 'FilteredData')
    const { Option } = Select
    const {
      record: { loading, downloading },
      user,
    } = this.props
    const tableColumns = [
      {
        title: () => <FormattedMessage id="project.setting.userName" />,
        dataIndex: 'userName',
        key: 'name',
      },
      {
        title: () => <FormattedMessage id="recordList.content" />,
        dataIndex: 'content',
        key: 'content',
        render: (text, record) => (
          <p>
            {record.content.length > 20 ? `${record.content.slice(0, 20)} ....` : record.content}
          </p>
        ),
      },
      {
        title: () => <FormattedMessage id="recordList.category" />,
        dataIndex: 'category',
        key: 'category',
        // render: text => <p>{text}</p>,
        render: text => {
          let element
          switch (text) {
            case '#ORDINARY':
              element = (
                <p>
                  <FormattedMessage id="recordList.categ1" />
                </p>
              )
              break
            case '#Accident':
              element = (
                <p>
                  <FormattedMessage id="recordList.categ2" />
                </p>
              )
              break
            case '#Review':
              element = (
                <p>
                  <FormattedMessage id="recordList.categ3" />
                </p>
              )
              break
            case '#Bureau':
              element = (
                <p>
                  <FormattedMessage id="recordList.categ4" />
                </p>
              )
              break
            case '#Material':
              element = (
                <p>
                  <FormattedMessage id="recordList.categ5" />
                </p>
              )
              break

            default:
              element = (
                <p>
                  <FormattedMessage id="recordList.categ6" />
                </p>
              )
          }
          return element
        },
      },

      {
        title: () => <FormattedMessage id="recordList.signed" />,
        dataIndex: 'signed',
        key: 'active',
        render: (signed, record) =>
          record.deleted ? (
            <Badge variant="danger">
              <FormattedMessage id="dashboard.deleted" />
            </Badge>
          ) : (
            <>
              {signed ? (
                <Badge variant="success">
                  <FormattedMessage id="recordList.signed" />
                </Badge>
              ) : (
                <Badge variant="warning">
                  <FormattedMessage id="recordList.unsigned" />
                </Badge>
              )}
            </>
          ),
      },
      // {
      //   title: () => <FormattedMessage id="recordList.download" />,
      //   dataIndex: 'signedUrl',
      //   render: (url, record) =>
      //     record.signed && this.role() !== 'DISABLE' ? (
      //       <div>
      //         <Button onClick={() => this.downloadHandel(url, record)}>
      //           <FormattedMessage id="recordList.download" />
      //         </Button>
      //       </div>
      //     ) : null,
      // },
      {
        title: () => <FormattedMessage id="dashboard.detail" />,
        dataIndex: 'details',
        render: (text, record) => {
          const flag = !record.signed && this.role() === 'WRITE' && user.ID === record.userID

          return (
            <div className="d-flex" style={{ justifyContent: 'flex-end' }}>
              <div className="mr-2">
                <Button
                  disabled={!record.signed || this.role() === 'DISABLE'}
                  onClick={() => this.downloadHandel(record.url, record)}
                >
                  <FormattedMessage id="recordList.download" />
                </Button>
              </div>
              <Button
                disabled={this.role() === 'DISABLE' || user.ID !== record.userID}
                onClick={() => this.editProject(record.ID, record)}
              >
                {record.signed ||
                record.deleted ||
                this.role() === 'DISABLE' ||
                this.role() === 'READ' ||
                user.ID !== record.userID ? (
                  <FormattedMessage id="dashboard.detail" />
                ) : (
                  <FormattedMessage id="projectList.edit" />
                )}
              </Button>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 10 }}>
                <Button
                  style={{ marginRight: 10 }}
                  disabled={(!record.deleted && !flag) || record.deleted}
                  onClick={() => this.setState({ recordId: record.ID, showModal: true })}
                  type="danger"
                >
                  <FormattedMessage id="project.setting.delete" />
                </Button>

                <Button
                  disabled={!record.deleted || (record.deleted && !flag)}
                  onClick={() => this.setState({ recordId: record.ID, showHardModal: true })}
                  type="danger"
                >
                  <FormattedMessage id="recordList.Hdelete" />
                </Button>
              </div>
            </div>
          )
        },
      },
      // {
      //   title: () => <FormattedMessage id="project.setting.delete" />,
      //   dataIndex: 'delete',
      //   render: (text, record) => (

      //   ),
      // },
    ]
    const convertData =
      filteredData &&
      filteredData.sort((a, b) => a.updatedAt.seconds - b.updatedAt.seconds).reverse()
    return (
      <div className="row">
        <Helmet title="Records" />
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="select-box">
                <Button
                  disabled={this.role() === 'DISABLE' || this.role() === 'READ'}
                  className="mb-2 mr-2"
                  onClick={() => this.editProject()}
                >
                  <FormattedMessage id="recordList.create" />
                </Button>
                <Select className="select" defaultValue="#ALL" onChange={this.handleChange}>
                  <Option value="#ALL">ALL</Option>
                  <Option value="#ORDINARY">
                    <FormattedMessage id="recordList.categ1" />
                  </Option>
                  <Option value="#ACCIDENT">
                    <FormattedMessage id="recordList.categ2" />
                  </Option>
                  <Option value="#REVIEW">
                    <FormattedMessage id="recordList.categ3" />
                  </Option>
                  <Option value="#BUREAU">
                    <FormattedMessage id="recordList.categ4" />
                  </Option>
                  <Option value="#MATERIAL">
                    <FormattedMessage id="recordList.categ5" />
                  </Option>
                  <Option value="#NONE">
                    <FormattedMessage id="recordList.categ6" />
                  </Option>
                </Select>
              </div>

              <Table
                loading={loading || downloading}
                className="utils__scrollTable"
                columns={tableColumns}
                dataSource={convertData || []}
                onChange={this.handleChange}
                pagination={{ pageSize: 10 }}
                size="middle"
                rowKey="key"
              />

              <WithModal
                showModal={showModal}
                hideModal={() => this.setState({ showModal: false })}
                deleteModal
              >
                <p>
                  <FormattedMessage id="recordList.HdeleteDesc" />
                </p>
                <Button
                  type="danger"
                  className="mr-2"
                  onClick={() => {
                    this.onSoftDeleteRecord(recordId)
                  }}
                >
                  <FormattedMessage id="recordList.confDel" />
                </Button>
                <Button onClick={() => this.setState({ showModal: false })}>Close</Button>
              </WithModal>

              <WithModal
                showModal={showHardModal}
                hideModal={() => this.setState({ showHardModal: false })}
                deleteModal
              >
                <p>
                  <FormattedMessage id="recordList.confHardDeldesc" />
                </p>
                <Button
                  type="danger"
                  className="mr-2"
                  onClick={() => {
                    this.onHardDeleteRecord(recordId)
                  }}
                >
                  <FormattedMessage id="recordList.confHardDel" />
                </Button>
                <Button onClick={() => this.setState({ showHardModal: false })}>Close</Button>
              </WithModal>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
