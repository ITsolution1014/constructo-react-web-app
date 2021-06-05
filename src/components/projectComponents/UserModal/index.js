import React from 'react'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import './UserModal.scss'

const UserModal = props => {
  const { setUserShowModal, project, setPassData } = props
  const { projectRole } = project

  const onClickHandle = role => {
    setPassData(role)
    setUserShowModal(true)
  }

  const customName = roleName => {
    let element
    switch (roleName) {
      case 'SYSTEM_ADMIN':
        element = <FormattedMessage id="project.roles.admin" />
        break
      case 'PROJECT_CREATOR':
        element = <FormattedMessage id="project.roles.creator" />
        break
      case 'GUEST':
        element = <FormattedMessage id="project.roles.guest" />
        break
      case 'ORDINARY':
        element = <FormattedMessage id="project.roles.ordinary" />
        break
      default:
        element = roleName
        break
    }

    return element
  }

  return (
    <React.Fragment>
      <div className="user-list">
        <div className="user-list-title">
          <h3 className="modal-title">
            <FormattedMessage id="project.management.modal.configRoles.modalName" />
          </h3>
          <span>
            <FormattedMessage id="project.management.modal.configRoles.modaldesc" />
          </span>
        </div>

        <div className="user-list-box">
          <Button onClick={() => onClickHandle(null)} className="w-100 mt-2">
            <FormattedMessage id="project.management.modal.configRoles.modalbtnAdd" />
          </Button>

          <div className="user-add-list">
            {projectRole.length &&
              projectRole.map(role => (
                <div
                  role="button"
                  onClick={() => onClickHandle(role)}
                  onKeyDown={() => onClickHandle(role.id)}
                  key={role.id}
                  tabIndex={0}
                  className="user-add-list-item"
                >
                  {customName(role.roleName)}
                </div>
              ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    project: state.project,
    user: state.user,
    settings: state.settings,
  }
}

export default connect(mapStateToProps, null)(UserModal)
