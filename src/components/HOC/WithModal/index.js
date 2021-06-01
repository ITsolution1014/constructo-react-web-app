import React from 'react'
import { Modal, Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import './modal.scss'

export default function WithModal({
  showModal,
  hideModal,
  children,
  config,
  main,
  userModal,
  deleteModal,
}) {
  return (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      visible={showModal}
      centered
      className={
        (main && 'model-box') ||
        (userModal && 'user-modal') ||
        (config && 'config-modal') ||
        (deleteModal && 'delete-modal')
      }
      onCancel={hideModal}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
    >
      {children}
      {!config && !deleteModal ? (
        <Button className="w-100 mt-2" onClick={hideModal}>
          <FormattedMessage id="project.management.modal.configRoles.modalbtnClose" />
        </Button>
      ) : (
        ''
      )}
    </Modal>
  )
}
