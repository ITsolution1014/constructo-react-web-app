import React from 'react'
import { Table, Button, Modal } from 'antd'
import { FormattedMessage } from 'react-intl'
import {
  DownCircleTwoTone,
  VideoCameraTwoTone,
  DeleteTwoTone,
  FilePdfTwoTone,
} from '@ant-design/icons'
import { handleTimeStamp } from '../../helpers'

export default ({ loading, files, deleteFile, write, role }) => {
  const [visible, setVisiable] = React.useState(false)
  const [image, setImg] = React.useState(false)
  const tableColumns = [
    {
      title: () => <FormattedMessage id="recordDetails.fileName" />,
      dataIndex: 'name',
      key: 'name',
      render: text => <p>{text.length > 10 ? `${text.slice(0, 10)} ....` : text}</p>,
    },
    {
      title: () => <FormattedMessage id="recordDetails.ext" />,
      dataIndex: 'ext',
      key: 'ext',
      render: text => <p>{text.length > 10 ? `${text.slice(0, 10)}...` : text}</p>,
    },

    {
      title: () => <FormattedMessage id="recordDetails.mod" />,
      dataIndex: 'module',
      key: 'active',
      render: text => <p>{text}</p>,
    },
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      render: text => <p>{text.length > 10 ? `${text.slice(0, 10)}...` : text}</p>,
    },
    {
      title: () => <FormattedMessage id="project.setting.cerate" />,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => (
        <p>
          {handleTimeStamp(createdAt.seconds).length > 9
            ? `${handleTimeStamp(createdAt.seconds).slice(0, 9)}...`
            : handleTimeStamp(createdAt.seconds)}
        </p>
      ),
    },
    {
      title: () => <FormattedMessage id="recordDetails.preview" />,
      dataIndex: 'storage',
      render: (file, data) => (
        <div>
          {data.ext.includes('image') ? (
            <Button
              size="small"
              disabled={role() === 'DISABLE'}
              onClick={() => {
                setImg(data.storageUrl)
                setVisiable(!visible)
              }}
            >
              <FormattedMessage id="recordDetails.view" />
            </Button>
          ) : null}
          {data.ext.includes('video') ? (
            <VideoCameraTwoTone />
          ) : (
            !data.ext.includes('image') && !data.ext.includes('video') && <FilePdfTwoTone />
          )}
        </div>
      ),
    },
    {
      title: () => <FormattedMessage id="project.setting.delete" />,
      dataIndex: 'details',
      render: (file, data) => (
        <div>
          <Button
            className="d-none d-md-block d-lg-block"
            disabled={write}
            type="danger"
            size="small"
            onClick={() => deleteFile(data)}
          >
            <FormattedMessage id="project.setting.delete" />
          </Button>
          <DeleteTwoTone className="d-block d-md-none d-lg-none" onClick={() => deleteFile(data)} />
          {/* <Button icon={<Icon type='delete' />} /> */}
        </div>
      ),
    },
    {
      title: () => <FormattedMessage id="recordList.download" />,
      dataIndex: 'storageUrl',
      render: file => (
        <div>
          <Button
            className="d-none d-md-block d-lg-block"
            disabled={role() === 'DISABLE'}
            type="primary"
            size="small"
            onClick={() => window.open(file, '_blank')}
          >
            <FormattedMessage id="recordList.download" />
          </Button>
          <DownCircleTwoTone
            onClick={() => window.open(file, '_blank')}
            className="d-block d-md-none d-lg-none"
            size="small"
          />
        </div>
      ),
    },
  ]
  const filtered =
    files &&
    files.map(item => {
      return { ...item, key: Math.floor(Math.random() * 100000) }
    })

  const handelCancel = () => setVisiable(!visible)

  return (
    <div>
      <Table
        loading={loading}
        className="utils__scrollTable file-list-table"
        scroll={{ x: '100%' }}
        columns={tableColumns}
        dataSource={filtered || []}
        // onChange={this.handleChange}
        pagination={{ pageSize: 2 }}
        size="middle"
        rowKey="key"
      />
      <Modal visible={visible} title="Image" footer={null} onCancel={handelCancel}>
        <img alt="example" style={{ width: '100%' }} src={image} />
      </Modal>
    </div>
  )
}
