import React from 'react'
import { Modal, Button } from 'antd'

export default props => {
  const {
    visibleDeleteModal,
    handleCancel,
    projectId,
    uid,
    name,
    dispatch,
    loading,
    currentProject,
  } = props

  return (
    <Modal
      title="Alert"
      visible={visibleDeleteModal}
      onCancel={handleCancel}
      footer={[
        <Button key="back" className="footerBtn" onClick={handleCancel}>
          Return
        </Button>,
        <Button
          loading={loading}
          key="submit"
          className="footerBtn"
          type="danger"
          onClick={() =>
            dispatch({
              type: 'project/DELETE_PROJECT_BY_ID',
              payload: { projectId, uid, currentProject },
            })
          }
        >
          Submit
        </Button>,
      ]}
    >
      <p>Are you sure to delete this {name} project?</p>
    </Modal>
  )
}
