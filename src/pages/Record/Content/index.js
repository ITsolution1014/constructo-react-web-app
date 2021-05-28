import React from 'react'
import { TreeSelect, Form, Input, Upload, Button, Icon, Empty } from 'antd'
import { DeleteTwoTone } from '@ant-design/icons'
import { FormattedMessage } from 'react-intl'
import FileList from '../../../components/RecordComponents/FileList'

const { TreeNode } = TreeSelect
const { Dragger } = Upload
const { TextArea } = Input
const FormItem = Form.Item

export default ({
  formHandel,
  getFile,
  loading,
  category,
  signed,
  deleted,
  content,
  files,
  deleteFile,
  write,
  role,
}) => {
  const [fileList, setfileList] = React.useState([])
  const removeHandler = indx => {
    const sd = [...fileList]
    sd.splice(indx, 1)
    setfileList(sd)
  }

  React.useEffect(() => {
    setfileList([])
  }, [loading])

  return (
    <section style={{ minHeight: '800px' }} className="card">
      <div className="card-body">
        <Form hideRequiredMark layout="vertical">
          <div style={{ width: '100%', height: '100%' }}>
            <FormItem label={<FormattedMessage id="recordDetails.desc" />}>
              {(content && signed) || deleted ? (
                <div style={{ width: '100%', height: '130px' }}>
                  <p>{content}</p>
                </div>
              ) : (
                <div>
                  {formHandel.getFieldDecorator('content', {
                    initialValue: content || '',
                    rules: [
                      { required: true, message: 'Please input your Full description' },
                      { max: 200, message: 'Full description must be maximum 200 characters.' },
                    ],
                  })(
                    <TextArea
                      // disabled={recordUserId ? signed || userId !== recordUserId || deleted : false}
                      disabled={write}
                      rows={10}
                      id="product-edit-fulldescr"
                    />,
                  )}
                </div>
              )}
            </FormItem>
          </div>
          <div className="mt-2">
            <FormItem label={<FormattedMessage id="recordList.category" />}>
              {formHandel.getFieldDecorator('category', {
                initialValue: category || '#ORDINARY',
                rules: [{ required: true, message: 'Please select Category' }],
              })(
                <TreeSelect
                  id="product-edit-category"
                  showSearch
                  style={{ width: '100%', display: 'block' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="Please select category"
                  allowClear
                  treeDefaultExpandAll
                  onChange={val => console.log(val, ' val')}
                  // disabled={recordUserId ? signed || userId !== recordUserId || deleted : false}
                  disabled={write}
                >
                  <TreeNode
                    value="#ORDINARY"
                    title={<FormattedMessage id="recordList.categ1" />}
                    key="0-0"
                  />
                  <TreeNode
                    value="#ACCIDENT"
                    title={<FormattedMessage id="recordList.categ2" />}
                    key="0-1-0"
                  />
                  <TreeNode
                    value="#REVIEW"
                    title={<FormattedMessage id="recordList.categ3" />}
                    key="0-1-1"
                  />
                  <TreeNode
                    value="#BUREAU"
                    title={<FormattedMessage id="recordList.categ4" />}
                    key="1-0"
                  />
                  <TreeNode
                    value="#MATERIAL"
                    title={<FormattedMessage id="recordList.categ5" />}
                    key="1-1-0"
                  />
                  <TreeNode
                    value="#NONE"
                    title={<FormattedMessage id="recordList.categ6" />}
                    key="1-1-1"
                  />
                </TreeSelect>,
              )}
            </FormItem>
          </div>
          <div style={{ width: '100%' }} className="row">
            <FileList
              loading={loading}
              files={files}
              deleteFile={deleteFile}
              write={write}
              role={role}
            />
          </div>
          <div className="row mt-2">
            <div className="col-12 col-md-6 col-lg-6 ">
              <div
                className="mb-2 mb-md-0 mb-lg-0"
                style={{
                  // border: '1px solid #000',
                  maxHeight: '200px',
                  minHeight: '200px',
                  overflowY: fileList.length > 5 ? 'scroll' : 'hidden',
                }}
              >
                <ul style={{ padding: 0 }}>
                  {fileList.length > 0 ? (
                    fileList.map((ele, ind) => (
                      <li
                        key={Math.random()}
                        style={{ listStyle: 'none', padding: '10px 0 10px 7px' }}
                      >
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
            <div className="col-12 col-md-6 col-lg-6" style={{ height: '80%' }}>
              <div className="mb-2">
                <Button
                  // disabled={recordUserId ? signed || userId !== recordUserId || deleted : false}
                  disabled={write}
                  loading={loading}
                  onClick={() => getFile(fileList)}
                  style={{ width: '100%' }}
                >
                  <Icon type="upload" /> <FormattedMessage id="recordDetails.upload" />
                </Button>
              </div>
              <Dragger
                // disabled={recordUserId ? signed || userId !== recordUserId || deleted : false}
                disabled={write}
                onChange={info => setfileList([...fileList, info.file])}
                multiple
                className="d-block"
                customRequest={() => null}
                // fileList={fileList}
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
            </div>
          </div>
        </Form>
      </div>
    </section>
  )
}
