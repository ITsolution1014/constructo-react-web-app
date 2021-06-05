import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { Button, Radio, Spin, notification } from 'antd'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './configureRoles.scss'

const ConfigureRoles = props => {
  const { ProjectCreator } = props
  const [roleName, setRoleName] = useState('')
  const [diary, setDiary] = useState('')
  const [filesRule, setfilesRule] = useState('')
  const [role, setRole] = useState('')
  const [projectRule, setProjectRule] = useState('')
  const [versionsRule, setVersionsRule] = useState('')
  const [signingRule, setSigningRule] = useState('')
  const [selectedRoleData, setSelectedRoleData] = useState(null)
  const [deleted, setDelete] = useState(false)
  const [roleId, setRoleId] = useState('')

  const { passData, setUserShowModal, project, dispatch } = props
  const valid =
    roleName && diary && filesRule && role && projectRule && versionsRule && signingRule && roleId

  const { currentProject } = project || {}
  const { projectID } = currentProject || {}
  const userProjects = project && project.userProjects
  const { ID } = userProjects || {}
  useEffect(() => {
    if (passData && Object.values(passData).length) {
      setRoleName(passData.roleName)
      setDiary(passData.diaryRule)
      setfilesRule(passData.filesRule)
      setRole(passData.rolesRule)
      setProjectRule(passData.projectRule)
      setVersionsRule(passData.versionsRule)
      setSigningRule(passData.signingRule)
      setSelectedRoleData(passData)
      setRoleId(passData.ID || passData.id)
      setDelete(passData.filesDeleteRule ? 'true' : 'false')
    } else if (passData === null) {
      setRoleName('')
      setDiary('')
      setfilesRule('')
      setRole('')
      setProjectRule('')
      setVersionsRule('')
      setSigningRule('')
      setSelectedRoleData(null)
      setRoleId('')
      setDelete(false)
    }
  }, [passData])

  const onChange = e => {
    switch (e.target.name) {
      case 'projectRule':
        setProjectRule(e.target.value)
        break
      case 'roleName':
        setRoleName(e.target.value)
        break
      case 'diary':
        setDiary(e.target.value)
        break
      case 'filesRule':
        setfilesRule(e.target.value)
        break
      case 'roles':
        setRole(e.target.value)
        break
      case 'versionsRule':
        setVersionsRule(e.target.value)
        break
      case 'signingRule':
        setSigningRule(e.target.value)
        break
      case 'deleted':
        setDelete(e.target.value)
        break
      default:
        break
    }
  }

  const onSubmit = async () => {
    let obj = {
      diaryRule: diary,
      filesRule,
      rolesRule: role,
      roleName,
      projectID: projectID || ID,
      projectRule,
      versionsRule,
      signingRule,
      deleted: false,
      filesDeleteRule: deleted === 'true',
    }

    if (selectedRoleData && Object.values(selectedRoleData).length) {
      obj = {
        ...selectedRoleData,
        ...obj,
      }
      const res = await dispatch({
        type: 'project/UPDATE_OLD_ROLE',
        payload: { obj, userProjects },
      })
      if (res && res.payload && Object.values(res.payload).length) {
        await dispatch({ type: 'project/GET_PROJECT_BY_ID', payload: projectID || ID })

        setSelectedRoleData(null)
        setSelectedRoleData(null)
        setUserShowModal(false)
        setRoleName('')
        setDiary('')
        setfilesRule('')
        setRole('')
        setProjectRule('')
        setVersionsRule('')
        setSigningRule('')
        setSelectedRoleData(null)
        setRoleId('')
        setDelete('false')

        notification.success({
          message: 'Role Updated',
          description: 'Role updated successfully',
        })
      }
    } else {
      const res = await dispatch({
        type: 'project/UPLOAD_NEW_ROLE',
        payload: { obj, userProjects },
      })
      if (res && res.payload && Object.values(res.payload).length) {
        await dispatch({ type: 'project/GET_PROJECT_BY_ID', payload: projectID || ID })
        setSelectedRoleData(null)
        setUserShowModal(false)
        setRoleName('')
        setDiary('')
        setfilesRule('')
        setRole('')
        setProjectRule('')
        setVersionsRule('')
        setSigningRule('')
        setSelectedRoleData(null)
        setRoleId('')
        setDelete('false')

        notification.success({
          message: 'New Role Added',
          description: 'Successfully added a new role',
        })
      }
    }
  }

  const definedRoles =
    roleName === 'PROJECT_CREATOR' ||
    roleName === 'SYSTEM_ADMIN' ||
    roleName === 'GUEST' ||
    roleName === 'ORDINARY'
  const deleteRole = async () => {
    if (
      roleName !== 'PROJECT_CREATOR' &&
      roleName !== 'SYSTEM_ADMIN' &&
      roleName !== 'GUEST' &&
      roleName !== 'ORDINARY'
    ) {
      if (projectID || (ID && roleId && valid)) {
        const res = await dispatch({
          type: 'project/DELETE_ROLE',
          payload: {
            projectId: projectID || ID,
            roleId,
            Users: passData.users || [],
            userProjects,
          },
        })
        if (res && res.payload && Object.values(res.payload).length) {
          await dispatch({ type: 'project/GET_PROJECT_BY_ID', payload: projectID || ID })
          setProjectRule('')
          setVersionsRule('')
          setSigningRule('')
          setSelectedRoleData(null)
          setRoleId('')
          setUserShowModal(false)
          notification.success({
            message: 'Role Deleted',
            description: 'Successfully deleted role',
          })
        }
      }
    } else {
      notification.warn({
        message: 'Role Message',
        description: `You Can not Delete ${roleName} Role`,
      })
    }
  }

  return (
    <React.Fragment>
      <div className="configure-list-title">
        <h3 className="role-title">
          <FormattedMessage id="project.management.modal.configRoles.newRoleName" />
        </h3>
        <span>
          <FormattedMessage id="project.management.modal.configRoles.newRoledec" />
        </span>
      </div>
      <div className="configure-role-form">
        <Form>
          <Form.Label>
            <FormattedMessage id="projectList.name" />
          </Form.Label>
          <Form.Group>
            <Form.Control
              disabled={ProjectCreator || definedRoles}
              onChange={onChange}
              name="roleName"
              value={roleName}
              placeholder="Example Project manager"
            />
            <Spin spinning={false}>
              <Button
                loading={project.loading}
                disabled={
                  ProjectCreator || !roleName || !filesRule || !diary || !role || definedRoles
                }
                onClick={() => onSubmit()}
                className="w-100"
              >
                <FormattedMessage id="project.save" />
              </Button>
            </Spin>
          </Form.Group>
        </Form>
      </div>
      <div className="configure-list-box">
        <ul className="configure-list">
          <li>
            <div className="configure-name">
              <p>
                <FormattedMessage id="project.management.modal.configRoles.newRoleProject" />
              </p>
            </div>

            <Radio.Group
              disabled={ProjectCreator || definedRoles}
              onChange={onChange}
              value={projectRule}
              name="projectRule"
            >
              <Radio.Button value="READ">
                <FormattedMessage id="project.management.modal.configRoles.fields1" />
              </Radio.Button>
              <Radio.Button value="WRITE">
                <FormattedMessage id="project.management.modal.configRoles.fields2" />
              </Radio.Button>
              <Radio.Button value="DISABLE">
                <FormattedMessage id="project.management.modal.configRoles.fields3" />
              </Radio.Button>
            </Radio.Group>
          </li>
          <li>
            <div className="configure-name">
              <p>
                <FormattedMessage id="dashboard.diary" />
              </p>
            </div>

            <Radio.Group
              disabled={ProjectCreator || definedRoles}
              onChange={onChange}
              value={diary}
              name="diary"
            >
              <Radio.Button value="READ">
                <FormattedMessage id="project.management.modal.configRoles.fields1" />
              </Radio.Button>
              <Radio.Button value="WRITE">
                <FormattedMessage id="project.management.modal.configRoles.fields2" />
              </Radio.Button>
              <Radio.Button value="DISABLE">
                <FormattedMessage id="project.management.modal.configRoles.fields3" />
              </Radio.Button>
            </Radio.Group>
          </li>
          <li>
            <div className="configure-name">
              <p>
                <FormattedMessage id="project.management.modal.configRoles.newRoledoc" />
              </p>
            </div>
            <Radio.Group
              disabled={ProjectCreator || definedRoles}
              name="filesRule"
              onChange={onChange}
              value={filesRule}
            >
              <Radio.Button value="READ">
                <FormattedMessage id="project.management.modal.configRoles.fields1" />
              </Radio.Button>
              <Radio.Button value="WRITE">
                <FormattedMessage id="project.management.modal.configRoles.fields2" />
              </Radio.Button>
              <Radio.Button value="DISABLE">
                <FormattedMessage id="project.management.modal.configRoles.fields3" />
              </Radio.Button>
            </Radio.Group>
          </li>
          <li>
            <div className="configure-name">
              <p>
                <FormattedMessage id="project.management.modal.configRoles.newRoledel" />
              </p>
            </div>
            <Radio.Group
              disabled={ProjectCreator || definedRoles}
              name="deleted"
              onChange={onChange}
              value={deleted}
            >
              <Radio.Button value="true">
                <FormattedMessage id="project.management.modal.configRoles.true" />
              </Radio.Button>
              <Radio.Button value="false">
                <FormattedMessage id="project.management.modal.configRoles.false" />
              </Radio.Button>
            </Radio.Group>
          </li>
          <li>
            <div className="configure-name">
              <p>
                <FormattedMessage id="project.management.modal.configRoles.modalName" />
              </p>
            </div>
            <Radio.Group
              disabled={ProjectCreator || definedRoles}
              onChange={onChange}
              value={role}
              name="roles"
            >
              <Radio.Button value="READ">
                <FormattedMessage id="project.management.modal.configRoles.fields1" />
              </Radio.Button>
              <Radio.Button value="WRITE">
                <FormattedMessage id="project.management.modal.configRoles.fields2" />
              </Radio.Button>
              <Radio.Button value="DISABLE">
                <FormattedMessage id="project.management.modal.configRoles.fields3" />
              </Radio.Button>
            </Radio.Group>
          </li>
          <li>
            <div className="configure-name">
              <p>
                <FormattedMessage id="project.management.modal.configRoles.newRoleVer" />
              </p>
            </div>

            <Radio.Group
              disabled={ProjectCreator || definedRoles}
              onChange={onChange}
              value={versionsRule}
              name="versionsRule"
            >
              <Radio.Button value="READ">
                <FormattedMessage id="project.management.modal.configRoles.fields1" />
              </Radio.Button>
              <Radio.Button value="WRITE">
                <FormattedMessage id="project.management.modal.configRoles.fields2" />
              </Radio.Button>
              <Radio.Button value="DISABLE">
                <FormattedMessage id="project.management.modal.configRoles.fields3" />
              </Radio.Button>
            </Radio.Group>
          </li>
          <li>
            <div className="configure-name">
              <p>
                <FormattedMessage id="project.management.modal.configRoles.newRoleSign" />
              </p>
            </div>

            <Radio.Group
              disabled={ProjectCreator || definedRoles}
              onChange={onChange}
              value={signingRule}
              name="signingRule"
            >
              <Radio.Button value="READ">
                <FormattedMessage id="project.management.modal.configRoles.fields1" />
              </Radio.Button>
              <Radio.Button value="WRITE">
                <FormattedMessage id="project.management.modal.configRoles.fields2" />
              </Radio.Button>
              <Radio.Button value="DISABLE">
                <FormattedMessage id="project.management.modal.configRoles.fields3" />
              </Radio.Button>
            </Radio.Group>
          </li>
        </ul>
        <Button
          loading={project.loading}
          disabled={!valid || ProjectCreator}
          className="w-100 mt-2"
          onClick={() => deleteRole()}
        >
          <FormattedMessage id="project.management.modal.configRoles.delBtn" />
        </Button>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    project: state.project,
    user: state.user,
  }
}

export default connect(mapStateToProps, null)(ConfigureRoles)
