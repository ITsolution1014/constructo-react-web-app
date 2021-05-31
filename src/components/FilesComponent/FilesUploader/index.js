import React from 'react'
import { Button, Form, Upload, Icon, Empty } from 'antd'
import { FormattedMessage } from 'react-intl'
import { DeleteTwoTone } from '@ant-design/icons'
import WithModal from '../../HOC/WithModal'

const { Dragger } = Upload

export default props => {
  const { setFileModal, fileModal, uploading, filesUpload } = props || {}
  const [fileList, setfileList] = React.useState([])

  const removeHandler = indx => {
    const sd = [...fileList]
    sd.splice(indx, 1)
    setfileList(sd)
  }
  React.useEffect(() => {
    setfileList([])
  }, [fileModal])
  return (
    <React.Fragment>
      <WithModal showModal={fileModal} hideModal={() => setFileModal()} deleteModal>
        <Form.Item label="">
          <Dragger
            onChange={info => setfileList([...fileList, info.file])}
            multiple
            className="d-block"
            customRequest={() => null}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              <FormattedMessage id="recordDetails.dragHead1" />
            </p>
            <p className="ant-upload-hint">
              <FormattedMessage id="recordDetails.dragHead2" />
            </p>
          </Dragger>
        </Form.Item>
        <div className="col-12 col-md-12 col-lg-12 ">
          <div className="mb-2 mb-md-0 mb-lg-0">
            <ul style={{ padding: 0 }}>
              {fileList.length > 0 ? (
                fileList.map((ele, ind) => (
                  <li key={Math.random()} style={{ listStyle: 'none', padding: '10px 0 10px 7px' }}>
                    {ele.name.length > 10 ? `${ele.name.slice(0, 10)} ...` : ele.name}{' '}
                    <DeleteTwoTone onClick={() => removeHandler(ele, ind)} />
                  </li>
                ))
              ) : (
                <Empty />
              )}
            </ul>
          </div>
        </div>
        <Button
          onClick={() => filesUpload(fileList)}
          loading={uploading}
          type="primary"
          className="mr-2"
        >
          {uploading ? (
            <FormattedMessage id="files&foolders.uplo" />
          ) : (
            <FormattedMessage id="files&foolders.upload" />
          )}
        </Button>
        <Button onClick={() => setFileModal()}>
          <FormattedMessage id="project.management.modal.configRoles.modalbtnClose" />
        </Button>
      </WithModal>
    </React.Fragment>
  )
}
